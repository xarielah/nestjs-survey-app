## Survey app TODOs

### General 

* Rate limit - *might need a cache service such as Redis to achieve this*.



### Survey routes

> PATCH - /api/survey/:id

Edit survey’s fields. Updating user must be the owner of the survey. User must be the owner.

* Name
* Description
* End date - *any rules?*



> DELETE - /api/survey/:id

<s>Deletes a survey. Might need to set rules, maybe an active flag or “isDeleted” flag in order to be able to restore or have it stay and then deleted after 30 days from deletion request for example. User must be the owner.</s>

**MAKE IT SO IT DELETES ALL RELATED DATA - CASCADE**



> \*NEW\* POST - /api/survey/:id

 Sets the end date to now of a survey. **User must be the owner**.



#### Further on features

* Notifications
	* Thank you - for participant
	* Survey created - for creator
	* Survey got a response - for creator
	* Survey ended - for participant? business stakeholders?

