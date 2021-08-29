# Github Recommender System

The task we addressed in this project is to create a recommender system for GitHub repositories, based on the implicit feedback captured when a user stars a repository.

In order to do that, we examined some datasets on Kaggle, but while there are some of them regarding GitHub, we couldn’t find a dataset containing information about user interactions. So, we decided to collect the data ourself, coding a website scraper which could provide us the following data for each repository:

- Repository name
- Repository owner
- Number of stars
- Number of forks
- Main language
- About (small description of the repo)
- Sponsor (true/false - some repo have the possibility to open donations)
- Last update time

Regarding users, instead, collected data about which user starred which repository. So, we thought about starting from a well-known repository like React and store all the users that starred that repo. Then, for each user we stored what other repositories he has starred.

We experimented with the Content-based filtering approach. Then, we tried the Collaborative Filtering approaches, implementing both neighbourhood CF and the Matrix Factorization approach.

Finally, in order to evaluate our work, we would use the following metrics: MAP@K and Personalization.

## Notebook

In this repo is stored the notebook used for the creation and validation of the recommender system, named `GitHub_Recommender_System.ipynb`. In order to run the notebook, Colab is needed since the project is made using the library `pyspark`.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1u32KDUAggSkbH_RGgMAyDF6ysIJ7P8XF)

## Results

In the following table the results obtained by the models are reported:

| Model                              | MAP@1     | MAP@2     | MAP@3     | MAP@4     | MAP@5     | Personalization |
| ---------------------------------- | --------- | --------- | --------- | --------- | --------- | --------------- |
| Content-based Filtering            | 0.067     | 0.051     | 0.043     | 0.037     | 0.033     | 0.676           |
| User-based Collaborative Filtering | 0.357     | 0.261     | 0.213     | 0.183     | 0.164     | **0.965**       |
| Item-Based Collaborative Filtering | 0.355     | 0.300     | 0.264     | 0.239     | 0.216     | 0.874           |
| Matrix Factorization               | **0.506** | **0.393** | **0.332** | **0.298** | **0.268** | 0.864           |

We can see that as expected the Matrix Factorization model is the best model, having a higher MAP value for all the ranks.

## Demo

Using the notebook as backend we realized a small demo which gives the possibility to inspect the reccomendations for all the users in the dataset. Moreover, it let define a fake user, selecting the repositories that he starred.

The demo is available at the following link, [https://recommend-hub.netlify.app/](https://recommend-hub.netlify.app/).
