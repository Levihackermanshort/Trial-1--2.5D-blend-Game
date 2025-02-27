# Trial-1--2.5D-blend-Game
Supposed theme:
The Chosen Wanderer game: Enter a whimsical world on the brink of chaos, combining exploration and action. The gameplay loop involves exploring dynamically generated environments with traps and hidden treasures, learning enemy attack patterns and weakpoints, and collecting resources for crafting. The 2.5D visual perspective allows for vibrant detailed locations that encourage exploration. Movement through these hand-crafted and procedurally generated maps includes abilities like a grappling hook to access hidden ledges and zip through levels. Battles include large encounters and also arena based challenge rooms. The light-hearted art style combined with the real-time action, delivers a fun experience. It focuses on empowering characters and their unique abilities by mastering the environment and encounters. 

 "The Chosen Wanderer" focusing on core movement mechanics, a simple procedurally generated environment, and basic combat. This version will demonstrate the 2.5D perspective and core gameplay loop.

 These changes:

Replace the React functional component with a regular function that creates and returns a Three.js mesh
Simplify the player creation process by directly creating the mesh
Add shadow casting to the player mesh for better visual quality
Remove the unnecessary React component lifecycle management since we're handling the mesh directly
The code should now work without the constructor error, while maintaining all the existing functionality. The player mesh is created once when the Game component mounts and is properly managed within the Three.js scene.

What it looks like:
![image](https://github.com/user-attachments/assets/095dd1f0-31ba-4bca-9ee2-6a6b5f63a3f9)

