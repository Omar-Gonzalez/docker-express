# Docker-Express-Mongo Container

## Project goal

I wanted a bootstrap project for my contractor & personal work, I usually go with python-django. But as of late, I felt in love with node-express-mongo, so for science and fun I decided to bootstrap an express-app with docker and the required boilerplate to make it work close to something like Django

## Front end

For the front end, I always favor a hybrid approach, while a SPA is great in some scenarios it can also be limiting, needless to say, that you end up loading tons of JS just to show a single page in some cases. I prefer to load single components on pages where they are needed, you can see an example in login.component.jsx and register.component.jsx. For simple static pages or presenting data, a template engine like EJS is more than enough.

Kudos to parcel-bundler for making possible a hassle-free react set up

## Usage

* Just set up your .env file following env-example
* docker-compose up
* Then docker-compose exec app npm install to avoid os specific binaries mix up
* Check docker-compose and env variables everything is pretty much self-explanatory
* You can enter mongo-ex at localhost:8081
* Nodemon is available for dev & Forever can be run in prod

## License

* [Omar Gonzalez](https://www.linkedin.com/in/omar-gonzalez-rocha-2199135a) &copy; 2019 - Code released under the MIT license.
