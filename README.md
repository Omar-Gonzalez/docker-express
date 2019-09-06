# Docker-Express-Mongo Container

##Project goal
I wanted a bootstrap project for my contractor & personal work, I usually go with python-django. But as of late I felt in love with node-express-mongo, so for science and for fun I decided to bootstrap a express-app with docker and the required boilerplate to make it work close to something like Django 

## Front end 
For the front end I always favor a hybrid approach, while a SPA is great in some scenarios it can also be limiting, needles to say that you end up loading tons of JS just to show a single page in some cases. I prefer to load single components in pages where they are actually **needed**, you can se an example in login.component.jsx and register.component.jsx. For simple static pages or presenting data a template engine like ejs is more than enough. 

Kudos to parcel bundler for making possible a hassle-free react set up 

## Usage 

* Just set up your .env file following env-example 
* Then docker-compose up 
* Nodemon is available for dev & Forever can be run in prod 
* If you need more react components follow the login & register example, and add the corresponting package.json scripts
* rb.sh can be used to build all react components at once

## License

* [Omar Gonzalez](https://www.linkedin.com/in/omar-gonzalez-rocha-2199135a) &copy; 2019 - Code released under the MIT license.
