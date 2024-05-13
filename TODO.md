## Survey app TODOs

### General 

* Rate limit - *might need a cache service such as Redis to achieve this*.



### Survey routes

> PATCH - /api/survey/:id

Edit survey’s fields. Updating user must be the owner of the survey. User must be the owner.

* Name
* Description
* End date - *any rules?*



---



Status: *DONE*

> DELETE - /api/survey/:id

Flag on the survey is stating if the survey is deleted (isDeleted) or not. After that, the survey is could not be fetched / edited.



---



Status: Work in progress

> \*NEW\* POST - /api/survey/:id/end

 Sets the end date to now of a survey. **User must be the owner**.



---



#### Further on features

* Notifications
	* Thank you - for participant
	* Survey created - for creator
	* Survey got a response - for creator
	* Survey ended - for participant? business stakeholders?

