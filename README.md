# Chatterbox

## Contents
- [Task 1 - Environment Setup](#task-1---environment-setup)
- [Task 2 - Run .NET backend](#task-2---run-net-backend)
- [Task 3 - Run Angular frontend](#task-3---run-angular-frontend)



## Overview

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat_4459a3f0-b65e-4df2-8c37-6ec72fcc4b31_PsmaM1un72g6lfGgyJR7yQ.png)

This is a simple chat app where users can send messages to a specific person. When the app loads, a new user is automatically created, and you can start chatting with them right away. The app keeps things minimal, focusing only on direct messaging without extra features.


## Clone the Repository

Open your terminal and run the following command to clone the repository:

    git clone https://github.com/alvinyanson/ChatterBox

After cloning, open the solution the `Chatterbox.sln`


## Task 1 - Environment Setup

    NET SDK: 8.0.303
    Angular: 16.0.3


## Task 2 - Run NET backend

Press F5 to compile and run the project

After successfully compiling, the backend should run in this URL: (you don't have to open this URL)

    https://localhost:7225


## Task 3 - Run Angular frontend

Open another instance of Developer Command Prompt in Visual Studio, then type this in the terminal:

    cd ChatterboxUI


Install npm packages:

    npm install


Run the project:

    npm start

After successfully compiling, the frontend should run in this URL:

    http://localhost:4200


## Open the application in browser

In the browser, paste this URL:


    http://localhost:4200/chat



Upon opening the application, the page will look like this:

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat.png)


Open another instance of the application, paste the below URL in another browser tab:


    http://localhost:4200/chat


After opening another instance (Tab 2), the page will look like this:

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat%20(1).png)


Go back to Tab 1, the page will look like this:

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat%20(2).png)


Start messaging the user, on Tab 1 click the user on the sidebar:

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat%20(3).png)


On Tab 2, see that the sent message has been received:

![Chatterbox Screenshot](https://raw.githubusercontent.com/alvinyanson/ChatterBox/refs/heads/main/localhost_4200_chat%20(4).png)



## Limitations

This application isn’t meant to cover every possible scenario; it’s simply a demonstration of how .NET SignalR works. That's why the demo only shows two users. If you open a third tab, it will create another user, and you can send messages between Tab 1 and Tab 3. (Tab 1 send a message to Tab 3).

If you notice something isn't working correctly and want to start fresh, clear any local data. Also, ensure that all open tabs running the application are closed.
