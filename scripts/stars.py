import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import csv
import os

# Read the users scraped
users_df = pd.read_csv("users.csv")

repo_fields = ["repo_id", "creator", "name", "about", "language", "stars", "forks", "updated", "sponsor"]
starred_fields = ["user_id", "repo_id"]

# Name of the csv to output for the starred relations
starred_target = "starred.csv"
# Name of the csv to output for the repos
repo_target = "repos.csv"

write_starred_header = False
write_repo_header = False

repo_map = dict()
starred_map = dict()

current_repo_id = 0

# If the starred repos csv doesn't exists add the header to it
if not os.path.exists(starred_target):
    write_starred_header = True

# If the repos csv doesn't exists add the header to it
if not os.path.exists(repo_target):
    write_repo_header = True

# Open or create the starred repos csv
starred_file = open(starred_target, "a", newline="", encoding="utf-8")
# Open or create the repos csv
repo_file = open(repo_target, "a", newline="", encoding="utf-8")

# If the starred repos csv exists
if not write_starred_header:
    # Read the content of the file
    r_file = open(starred_target, "r", newline="", encoding="utf-8")
    lines = r_file.readlines()
    
    # If the file is empty add the header
    if len(lines) == 0: write_starred_header = True

    # Otherwise save the relations already added
    if len(lines) > 1:
        starred = pd.read_csv(starred_target)
        for user_id in starred["user_id"].unique():
            starred_map[user_id] = starred[starred["user_id"] == user_id]["repo_id"].tolist()

# If the repos csv exists
if not write_repo_header:
    # Read the content of the file
    r_file = open(repo_target, "r", newline="", encoding="utf-8")
    lines = r_file.readlines()
    
    # If the file is empty add the header
    if len(lines) == 0: write_repo_header = True

    # Otherwise get the repos already added
    if len(lines) > 1:
        repo_map = pd.read_csv(repo_target, na_filter=False)
        current_repo_id = repo_map["repo_id"].max() + 1
        repo_map["fullname"] = repo_map["creator"] + "/" + repo_map["name"]
        repo_map = repo_map.set_index("fullname").to_dict("index")
        print("Starting from id", current_repo_id)

# Create two writers for the csv files
starred_writer = csv.writer(starred_file)
repo_writer = csv.writer(repo_file)

# If needed write the header in the starred repos csv
if write_starred_header:
    starred_writer.writerow(starred_fields)

# If needed write the header in the repos csv
if write_repo_header:
    repo_writer.writerow(repo_fields)

# For each user
for index, row in users_df.iterrows():
    user = row["name"]
    user_id = row["user_id"]

    print("User_id:", user_id)

    # If the user was already processed, skip it
    if user_id in starred_map:
        continue
    
    # Otherwise create the list of repos for that user
    starred_map[user_id] = []

    # Set the URL for the current user
    user_URL = "https://github.com/{}?tab=stars".format(user)
    flag = True

    # While we don't stop the execution
    while flag:
        print("Requesting page..." + user_URL)
        # Use requests to obtain the content of the user URL
        page = requests.get(user_URL, headers={"cookie": "*INSERT COOKIE*"})

        # Interpret the HTML using BeautifulSoup
        soup = BeautifulSoup(page.text, "html.parser")

        # Find the div containing all the starred repos
        div = soup.find("div", class_="col-lg-12")
        if div == None:
            div = soup.find("div", class_="col-lg-9")
            if div == None:
                # If there is an image it means that the user deleted the account
                img = soup.find("img", class_="js-plaxify")
                if img != None:
                    continue
                else:
                    flag = False
                    continue
        
        # Take all the starred repos in the current page
        items = div.find_all("div", class_="d-block")
        # For each starred repo
        for item in items:
            # Take the creator and name of the repository
            array = item.find("h3").find("a").text.strip().split(" / ")
            creator = array[0]
            name = array[1]

            fullname = creator + "/" + name

            # If the repo wasn't already added
            if fullname not in repo_map:
                # Take the description of the repo
                about_node = item.find("p")
                about = about_node.text.strip().replace("\n", "") if about_node else None

                # Take the bottom div
                bottom = item.find("div", class_="f6")

                # Take the main programming language of the repo
                lang_node = bottom.find("span", {"itemprop": "programmingLanguage"})
                language = lang_node.text.strip().replace("\n", "") if lang_node else None

                # Take the number of stars of the repo
                star_svg = bottom.find("svg", class_="octicon-star")
                stars = int(star_svg.parent.text.strip().replace(",", "").replace("\n", "")) if star_svg else None
                
                # Take the number of forks of the repo
                fork_svg = bottom.find("svg", class_="octicon-repo-forked")
                forks = int(fork_svg.parent.text.strip().replace(",", "").replace("\n", "")) if fork_svg else None

                # Take the date of the last update of the repo
                updated = bottom.find("relative-time").get("datetime").replace("\n", "")

                # Check if the repo can be sponsored or not
                right_container = item.find("div", class_="float-right")
                a_node = right_container.contents[1].name.replace("\n", "")
                sponsor = 1 if a_node == "a" else 0

                # Add the features to the map of the repos already found
                data = [current_repo_id, creator, name, about, language, stars, forks, updated, sponsor]
                repo_map[fullname] = {"repo_id": current_repo_id, "creator": creator, "name": name, "about": about, "language": language, "stars": stars, "forks": forks, "updated": updated, "sponsor": sponsor}

                # Write the new repo on the csv file
                repo_writer.writerow(data)
                # Write the relation between the current user and the new repo
                starred_writer.writerow([user_id, current_repo_id])

                # Save the relation
                starred_map[user_id].append(current_repo_id)

                current_repo_id += 1
            else:
                print("Repo", fullname, "already added!")
                # Write the relation between the current user and the new repo
                starred_writer.writerow([user_id, repo_map[fullname]["repo_id"]])
                # Save the relation
                starred_map[user_id].append(current_repo_id)
        
        print("Total repos:", current_repo_id)

        # Find the container of the pagination
        container = soup.find("div", class_="paginate-container")
        if container == None:
            flag = False
            continue
        
        # Take the link to the next page
        link = container.find_all("a")[-1]

        # If the text of the link isn't "Next", stop the execution
        if link.text != "Next":
            flag = False
            continue
        
        # Take the `href` value of the anchor element
        user_URL = link.get("href")

        # Wait some time, since we don't want to send too much requests
        time.sleep(.5)

# Close the opened files
starred_file.close()
repo_file.close()