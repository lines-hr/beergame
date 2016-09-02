# Beergame

*Beergame is role-play simulation game that lets players experience typical coordination problems of traditional supply chains.*

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities

In order to run this app in development env, you must install **Meteor**:

```
$ curl https://install.meteor.com/ | sh
```

### Installing

A step by step series of examples that tell you have to get a development env running.

First, you need to download the git repository

```
$ git clone git@github.com:lines-hr/beergame.git
```

Start the local server by executing next commands:

```
$ cd beergame/src
$ npm install
$ meteor
```

## Building and Deployment

To build a Beergame app, execute these commands under **src** directory:
```
$ npm install --production
$ meteor build ../build --architecture os.linux.x86_64
```

This will provide you with a bundled application .tar.gz in **build** directory which you can extract and run without the meteor tool. The environment you choose will need the correct version of Node.js and connectivity to a MongoDB server.

Depending on the version of Meteor you are using, you should install the proper version of node using the appropriate installation process for your platform.

 * Node 4.4.7 for Meteor 1.4.x
 * Node 0.10.43 for Meteor 1.3.x and earlier

You can then run the application by invoking node with a **ROOT_URL**, and **MONGO_URL**.
```
$ cd my_build_bundle_directory
$ (cd programs/server && npm install)
$ MONGO_URL=mongodb://localhost:27017/myapp ROOT_URL=http://my-app.com node main.js
```
 * **ROOT_URL** is the base URL for your Meteor project
 * **MONGO_URL** is a [Mongo connection string](https://docs.mongodb.com/manual/reference/connection-string/) URI supplied by the MongoDB provider.

## Contributing

TODO

## Authors

* **Kristijan Lenković** - [LinkedIn](https://www.linkedin.com/in/klenkovic)
* **Mislav Miočević** - [LinkedIn](https://www.linkedin.com/in/mislavmiocevic)

## License

Beergame is available under the [MIT license](http://opensource.org/licenses/MIT).

## Acknowledgments

TODO