# LogManagerApp

This is the client App side for the Qlik Sense web Log reader. This web client part need to connect with the Server counterpart [LogManagerAgent](https://github.com/expovin/LogManagerAgent) on the Qlik Sense Node.

###Installation
This is the web client part, so basically you need to publish it on a webserver. Since you need also the Server part ([LogManagerAgent], you can just copy the project folder in the [LogManagerAgent] "public" folder. On a multi node environment  you need to copy the project folder just on one [LogManagerAgent] node. Rename the project folder in app.
Download the latest node stable version from NodeJS site, install it and test if the installation finished succesfully checking the version of node and npm (node --version and npm --version). Download and unzip the project in a suitable location in your hard drive and from within the project folder type

```
npm install
```

and be patient nodeJs will download all the dependencies. If you copied it in the [LogManagerAgent] public folder you can access to the app by typing in the browser address bar:

```
http://<serverName>:3000/app
```

###How to use it
If everithing work as expected, you should see from your browser the LogManager home page
![Alt text](/images/HomePage.png)

From the home page the first think you want to do is connect to a Qlik Sense Node where the LogManagerAgent is up and running. All you need to do is put the Server name (or the ip-address) on the addressbar in the upper right corner. If the LogManagerAgent run correctly you should see the box with the server name and the list of all process running on the Server. You need to select the log(s) you want to read just clicking on the small icon next to the Service name. Once you get the log, you need to go to the log view by cliccking on the server name in the box title or from the nav bar, Logs --> <Server Name>. You will land on the Logs view

![Alt text](/images/LogView.png)

On the log view you can navigate through the different log file using the nav pills on the left. For each file will show only the first 5 coloumns, you can select all coloumns you want by clicking on the coloumn icon (the most right icon). 

![Alt text](/images/ColoumnSelection.png)

Log Manager will remember your choices, for each file, untill you will remove the server box from the home page. The log records show the different severity highlighting records in different colors. If you click on a record you will see all the fields details

![Alt text](/images/RecordDetails.png)

You can also search for specific words in all fields or in a specific field. Don't forget to chose where you want to find.

![Alt text](/images/Search.png)

