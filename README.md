# GitHub Recommender System

Distributed Recommender System for GitHub repositories based on the **implicit feedback** captured when a user stars a repository.

The system relies on a dataset containing information about **user interactions** on the GitHub website.
In order to collect it, we started from a well-known repository like React and we stored all the users that **starred** that repo.
Then, for each user we stored what other repositories he has starred.

In particular, for each **repository** the following data is avalable:
- Repository name
- Repository owner
- Number of stars
- Number of forks
- Main language
- About (small description of the repo)
- Sponsor (true/false - some repo have the possibility to open donations)
- Last update time

Regarding **users**, instead, we collected data about which user starred which repository. 

For the recommender system, we experimented with the **Content-based filtering approach** and we tried the Collaborative Filtering approaches, implementing both **Neighbourhood CF** and the **Matrix Factorization** approach.

Finally, in order to evaluate our work, we used the following metrics: **MAP@K** and **Personalization**.

## Contributors

<a href="https://github.com/dotmat3" target="_blank">
  <img src="https://img.shields.io/badge/Profile-Matteo%20Orsini-green?style=for-the-badge&logo=github&labelColor=blue&color=white">
</a>
<br /><br />
<a href="https://github.com/SkyLionx" target="_blank">
  <img src="https://img.shields.io/badge/Profile-Fabrizio%20Rossi-green?style=for-the-badge&logo=github&labelColor=blue&color=white">
</a>

## Notebook

In this repo is stored the **notebook** used for the creation and validation of the recommender system, named `GitHub_Recommender_System.ipynb`.

In order to run the notebook, Colab is suggested since the project is made using the `pyspark` library.

<a href="https://colab.research.google.com/github/dotmat3/github-recommender-system/blob/main/GitHub_Recommender_System.ipynb" target="_blank">
<img src="https://img.shields.io/badge/Colab-Open%20Notebook-green?style=for-the-badge&logo=googlecolab&color=blue">
</a>
<br/>
<br/>

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

Using the notebook as backend we realized a small **demo** which gives the possibility to inspect the recommendations for all the users in the dataset.
Moreover, it allows to define a fake user, selecting the repositories that he starred in order to test the system.

The **frontend** is available at the following link [https://recommend-hub.netlify.app/](https://recommend-hub.netlify.app/), but unfortunately 
the **backend** is **not hosted anymore**. However, it is possible to host it yourself directly in Colab, following the instructions provided at the end of the notebook.

### Home page

![home-1](https://user-images.githubusercontent.com/23276420/218273170-347874e1-cf08-499c-9f65-74d290d24831.png)
![home-2](https://user-images.githubusercontent.com/23276420/218273177-69d76e92-71ca-4834-aba9-ac9487d34699.png)

### Prediction results
![prediction](https://user-images.githubusercontent.com/23276420/218273181-027d23f0-ca40-4a5f-8f6c-69d97bc83a22.png)


## Technologies
The system is implemented using the Python language and the following libraries:
- `pyspark` as the distributed framework
- `pandas` to work with data
- `matplotlib` and `seaborn` to perform the EDA

Moreover, for the Web server the following technologies have been used:
- `flask` and `ngrok` Python libraries for the back-end
- `React.js` for the front-end

