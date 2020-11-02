**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Issue Tracker

1) SET NODE_ENV to `test` without quotes and set DB to your mongo connection string in .env file
2) Complete the project in `routes/api.js` or by creating a handler/controller
3) You will add any security features to `server.js`
4) You will create all of the functional tests in `tests/2_functional-tests.js`


# User Stories:
1. Prevent cross site scripting(XSS attack).
2. I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
3. The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
4. I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
5. I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
6. I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
7. I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
8. All 11 functional tests are complete and passing.

# Example get usage:
/api/issues/{project}<br />
/api/issues/{project}?open=true&assigned_to=Joe

# Example return:
```javascript
[
    {
        "_id":"5871dda29faedc3491ff93bb",
        "issue_title":"Fix error in posting data",
        "issue_text":"When we post data it has an error.",
        "created_on":"2017-01-08T06:35:14.240Z",
        "updated_on":"2017-01-08T06:35:14.240Z",
        "created_by":"Joe",
        "assigned_to":"Joe",
        "open":true,
        "status_text":"In QA"
    }
]
```