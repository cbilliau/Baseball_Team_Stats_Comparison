# Baseball Statistics Comparisons Regular Season 2016 - AngularJS & Angular Material UI

Compare the current year statistics between one National League and one American League team for the 2016 regular season using this Angular frontend API app.

![screenshot](/app/assets/baseball2.png "screenshot")

## Overview

The Baseball Statistics Comparisons Regular Season 2016 app allows any user to quicky compare regular season team stats. Comparison is currently only between teams from the two leagues, National League and American League. A filter is provided to turn off stats in order to focus only on those stats the user wants to see.


## Use Case

Quick an simple comparisons between League's teams is the primary focus of this app. Using the responsiveness of Angular and Material, this app quickly provides any baseball fan with entire team stats for the current regular season.


## Design

![screenshot](/app/assets/baseball1.png "screenshot")

Baseball Statistics Comparisons Regular Season 2016 is a lightweight purely frontend app using AngularJS to connect to an API and perform all the logic wrapped up in the popular Angular Material UI. To provide the user with use instructions while keeping the UI clutter-free, a modal (seen in above screenshot) is displayed every time the app is launched.


## Tech notes

* The app is built using Angular 1.5 and Angular Material.

* The app queries baseball stats and data from stattleship.com (https://stattleship.com).

* Data is pulled only on app launch as stats are only updated once each day at 7am EST each morning.


## Development Roadmap

This is v1.0 of the app. Future enhancements are expected to include:

* The ability to compare teams within the same league.

* Allow for post-season statistics display.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Installing

A step by step series of examples that tell you have to get a development env running.

1. Clone from https://github.com/cbilliau/Baseball_Team_Stats_Comparison

2. Then cd into the project directory and run 'npm install'.

3. Then `bower install`.

4. Move into app dir and start a local server.

5. Open a browser at localhost:8080.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* https://stattleship.com
