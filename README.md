The purpose of this app is to create a lightweight web-based polling sessions.

These are the key requirements which were defined by myself and Shay:
1. The app has to support a dynamic number of users
2. The app does not impose voting limits
3. The UI is stripped of everything unnecessary, and is simple as possible
4. The app does not rely on a single user host

To run locally, the user needs to have node.js installed and run the following commands:
>npm install
>npm start
Afterwards navigate to http://localhost:3000/ and use for local testing. This is however local.
For public connections, a web services provider is needed. At this time, we use Render, but possibly will migrate to Netlify.

________________________________________

**The flow and actions within the application**

When deployed on your web-provider of choice and given a static URL, navigate to be greeted with index.html.
<img width="454" height="215" alt="image" src="https://github.com/user-attachments/assets/3052bdd3-11b6-4d48-9bc0-f961f2588e30" />

You will be prompted to created a session. Doing so brings up the window to choose if you'd like to create as a player or an observer.
The key diffrence is the fact that observers do not vote, but are able to perform other actions.
<img width="745" height="515" alt="image" src="https://github.com/user-attachments/assets/ce24695b-f5ca-4f8c-a316-ec306dcc16e6" />

The user is then able to copy the invite link, to allow other users to join. I will create 3 users total for demonstration.
The app is not a sharing platform. The users will need to share the link through a communication channel outside.
<img width="768" height="639" alt="image" src="https://github.com/user-attachments/assets/e03ee426-a34a-4505-8f6e-136e3dca7fdf" />

Once everyone has voted, all users have the ability to reveal and clear votes. This is a feature.
When the votes are revealed, all users can see the votes, and the average of all votes.
<img width="715" height="642" alt="image" src="https://github.com/user-attachments/assets/fcc0de71-93db-4efc-9d5b-5f39c4c53109" />

Next, and perhaps the key reason why there are no permission based restriction, is the ability to join and leave whenever.
I will now leave with test1 original creator user.
<img width="712" height="605" alt="image" src="https://github.com/user-attachments/assets/cad78c4e-434d-4365-a76d-f06af4199a6d" />

As you can see, the other users see the change immediately, however are in no way affected. The session is still active.
A scenario is, if a manager needs to leave, or gets disconnected half-way through the meeting, the rest of the team can still vote.


________________________________________

**Memory, session-end, and additional notes**

For memory consumption, me and Shay conducted the a manual test with 8 players, 1 observers, each voting 25 rounds.
The following was the memory consumption. Further longer term testing needs to be done to understand if a token based provider is better.


While some code was created locally to force a session end, at this time it is not yet implemented.
Instead the app relies on free providers' ability to shut down when sensing inactivity for a period of time.
This does not however mean the app is innaccessible. When the user navigates to the base URL, they are presented with provider's boot up.
<img width="1615" height="1044" alt="image" src="https://github.com/user-attachments/assets/65651d7f-2bc4-4e59-97ba-52fbfe296ea8" />

This takes 10-15 seconds to spin up. Then the server is up. Users simply existing does not cause the usage to spike.
The usage originates from HTTP and WebSocket responses.


Besides simplistic UI, an additional feature implemented was package-lock, to ensure the **dependencies are always compatible**.
Also, in-memory storage, meaning **no session data gets saved**.
Here are some other features that could be implemented but were not to keep this app simple:
>Dark theme
>Confidence meter
>Custom vote values/"Not Sure" Values

________________________________________

**Conclusion**

This app is great for a small team within a company who need a solution for Agile style voting, made quick, easy, and reliable.
As the size of voters increases, the company needs to consider the usage and potentially implementing session termination logic.
