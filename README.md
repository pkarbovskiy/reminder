installation:
--
```npm ci```

running
--
```npm run start:server```

testing
--
``` npm run test ```

Solution:
--
when we receive the command(message) from clien then we update storade and state of the server.
if command with the same time and name is issues assuming duplicate and discard, 
otherwise we add it to the state and storage. if command came with time in the past we put into storage and not state.
As it's not specified if we want historic data on all the commands issues delete method is mplemented only for state operations.
It was not specified how server crash should be handled, so its just seeding state with data from storage. some mechanism like last time
reminder send can be added to avoid missing reminders and add graceful period as we dont want to send too old reminders.
Time is set to nearest min and converted to iso form. accepted time formats iso or YYYY-MM-DDTHH:mm. no validation on time is implemented
and all accepted forms are what moment understand out of the box, which can be extended with custom formats  


Assumptions based on requirements:
--
 - client will send message in format {name:string, time:sting}
 - no timezone is provided
 - no authentication
 - no https and no wss 
 - storage will be populated by proper channels and formats will be respected
    (not part of the requirements but extra savetly nets can be added if somehow data be populated not by app)

Weak parts:
--
 - no timezone consideration everything is server based when verifying if its time for reminder
 - very light on verification and error handling( except logging to console)
 - no time verification that it's time 
 - no max name limit (not specified in task can be an issue)
 - no sanitization of the name(not reuquired for mongo but required for any sql dbs)
 - no error sending to the client, no contruct for error is specified in the task
 - no authentication
 - no https or wss
 - low test covarage, never tested web sockets and testing "DB" implementation is antipattern for a lot of ppl; not all though

Note:
--
if you see potential and need me to add something let me know

