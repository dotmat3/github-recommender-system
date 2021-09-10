import requests
from bs4 import BeautifulSoup
import csv
import os
import pandas as pd
import time

# URL of the page to scrape
URL = "https://github.com/facebook/react/stargazers"
# Name of the csv to output
target = "users.csv"

flag = True
current_user_id = 0
user_map = dict()
fields = ["user_id", "name"]

# If the target csv doesn't exists write the header of the csv
writeHeader = False
if not os.path.exists(target):
    writeHeader = True

# Open in append mode or create the target file
file = open(target, "a", newline='')

# If the target already existed
if not writeHeader:
    # Open the file in read mode
    r_file = open(target, "r", newline='')
    # Read all content
    lines = r_file.readlines()
    
    # If the file is empty write the header
    if len(lines) == 0: writeHeader = True

    # Otherwise retrieve all the users already added
    if len(lines) > 1:
        user_map = pd.read_csv(target)
        current_user_id = user_map["user_id"].max() + 1
        user_map = user_map.set_index("name").to_dict("index")
        print("Starting from id", current_user_id)

# Create a csvwriter in order to write on the csv file
csvwriter = csv.writer(file)

# If the header flag is true write the header
if writeHeader:
    csvwriter.writerow(fields)

# While we don't stop the execution
while flag:
    print("Requesting page..." + URL)
    # Use requests to obtain the content of the URL
    page = requests.get(URL)

    # Interpret the HTML using BeautifulSoup
    soup = BeautifulSoup(page.text, "html.parser")
    # Find all the items representing a user
    items = soup.find_all("li", class_="follow-list-item")

    # For each item
    for item in items:
        # Take the username
        user = item.find("h3").find("a").text

        index = current_user_id

        # If the user wasn't already added
        if user not in user_map:
            # Save the user in the csv file
            user_map[user] = { "user_id": index }
            csvwriter.writerow([index, user])
            current_user_id += 1

    print("Total users:", len(user_map))

    # Take the container to the next page
    container = soup.find("div", class_="paginate-container")
    # If it isn't found, retry to scrape the same URL
    if container == None:
        continue
    
    # Take the last anchor element
    link = container.find_all("a")[-1]

    # If the text isn't "Next", stop the execution
    if link.text != "Next":
        flag = False
    
    # Take the `href` value of the anchor element
    URL = link.get("href")

    # Wait some time, since we don't want to send too much requests
    time.sleep(.5)

# Close the file opened
file.close()