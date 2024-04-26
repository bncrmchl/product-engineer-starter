# CoHelm Coding Assessment - Backend

This folder defines the components that make up the backend of the CoHelm coding assessment challenge. This application represents a simulated vertical slice of the products offered by CoHelm.

## Before You Begin
This project uses uvicorn to set up a fastapi-based API backend that is used to store and retrieve Case information. This API is leveraged by the included frontend application.
Ensure that you have installed the necessary python dependencies using the pip python dependency manager. 

### Installing project dependencies via pip:
Navigate to the /backend directory and run the following command:
```bash
sudo pip install -r requirements.txt
```

## Running the project locally:
Once you have the dependencies installed, you should be ready to run the backend using the following command from the /backend directory (the --reload argument will cause the app to be reloaded when changes to source files are detected, which is helpful for development purposes):
```bash
uvicorn main:app --reload
```

You should see output resembling the following:
```bash
INFO:     Will watch for changes in these directories: ['/home/bncrmchl/PycharmProjects/product-engineer-starter-cohelm/backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [681] using StatReload
INFO:     Started server process [683]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
 ```
 
This tells you the frontend is now available to navigate to on your localhost at the address http://localhost:8000. You can use the http client of your choice to interact with the API. 
 
## Postman collection
In the /backend directory, you will find a file called CoHelm.postman_collection.json. This file contains three pre-configured calls you can use to exercise the three endpoints created for this exercise. Use Postman's file->import tool to import this file and test out the endpoints.

## Misc notes
Please be aware that this application persists case data using tinydb, in a file called cases_db.json. If this dile doesn't exist, it will be created when the application launches.