# Github Recommender System

The task we would like to address in the project is to create a recommender system for GitHub repositories, based on the implicit feedback captured when a user stars a repository.

In order to do that, we examined some datasets on Kaggle, but while there are some of them regarding GitHub, we couldn’t find a dataset containing information about user interactions. So, we decided to collect the data ourself, coding a website scraper which could provide us the following data for each repository:

- Repository name
- Repository owner
- Number of stars
- Number of forks
- Main language
- About (small description of the repo)
- Sponsor (true/false - some repo have the possibility to open donations)
- Last update time

Regarding users, instead, we would like to collect data about which user starred which repository. So, we thought about starting from a well-known repository like React and store all the users that starred that repo. Then, for each user we can store what other repositories he has starred.

Since we would like to build a recommender system, and we can have access to the previous repository features, first we would like to experiment with the content based filtering approach. Then, we would also like to try the collaborative filtering approach, implementing both neighbourhood CF and the Matrix Factorization approach.

Finally, in order to evaluate our work, we would use the following metrics: MAP@K and Personalization.
