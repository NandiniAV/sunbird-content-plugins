var checkListConfigurations = {
    "reject": {
        "title": "Request Changes",
        "subtitle": "Please tick the reasons for requesting changes and provide detailed comments.",
        "contents": [{
                "name": "Appropriateness",
                "index": 1,
                "checkList": [
                    "Has Hate speech, Abuse, Violence, Profanity",
                    "Has Sexual content, Nudity or Vulgarity",
                    "Has Discrimination or Defamation content",
                    "Is not suitable for children"
                ]
            },
            {
                "name": "Content details",
                "index": 2,
                "checkList": [
                    "Inappropriate Title or Description",
                    // "Incorrect Board, Grade, Subject or Medium",
                    // "Inappropriate tags such as Resource Type or Concepts",
                    "Inappropriate tags such as Water Resource Type, Proficiency and Topic",
                    "Irrelevant Keywords and Language"
                ]
            },
            {
                "name": "Usability",
                "index": 3,
                "checkList": [
                    "Content does not play correctly ",
                    "Cannot see the content clearly on Desktop",
                    "Audio (if any) is unclear and difficult to understand",
                    "Spelling mistakes in the text",
                    "Language is not simple to understand"
                ]
            }
        ],
        "comments": {
            "required": true,
            "label": "Comments"
        },
        "buttons": {
            "cancel": "Cancel",
            "proceed": "Request changes"
        }
    },
    "publish": {
        "title": "Publish",
        "subtitle": "Please confirm that ALL the following items are verified (by ticking the check-boxes) before you can publish:",
        "contents": [{
                "name": "Appropriateness",
                "index": 1,
                "checkList": [
                    "No Hate speech, Abuse, Violence, Profanity",
                    "No Sexual content, Nudity or Vulgarity",
                    "No Discrimination or Defamation",
                    "Is suitable for children"
                ]
            },
            {
                "name": "Content details",
                "index": 2,
                "checkList": [
                    "Appropriate Title, Description",
                    // "Correct Board, Grade, Subject, Medium",
                    // "Appropriate tags such as Resource Type, Concepts",
                    "Appropriate tags such as Water Resource Type, Proficiency and Topic",
                    "Relevant Keywords and Language"
                ]
            },
            {
                "name": "Usability",
                "index": 3,
                "checkList": [
                    "Content plays correctly",
                    "Can see the content clearly on Desktop",
                    "Audio (if any) is clear and easy to understand",
                    "No Spelling mistakes in the text",
                    "Language is simple to understand"
                ]
            }
        ],
        "comments": {
            "required": false,
            "label": "Comments"
        },
        "buttons": {
            "cancel": "Cancel",
            "proceed": "Publish"
        }
    },
    "read": {
        "title": "Reviewer Suggestions",
        "subtitle": ""
    }
}