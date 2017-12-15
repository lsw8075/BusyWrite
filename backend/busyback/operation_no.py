from enum import Enum

class Operation(Enum):
    INVALID_OPERATION       = 0
    # document operations: 0xx
    FETCH_DOCUMENT          = 1
    FETCH_DOCUMENTS         = 2
    FETCH_CONTRIBUTORS      = 3
    FETCH_CONNECTEDS        = 4
    FETCH_TITLE             = 5
    CREATE_DOCUMENT         = 11
    DELETE_DOCUMENT         = 12
    ADD_TO_CONTRIBUTOR      = 21
    CHANGE_TITLE            = 31
    # user operations : 09x
    SIGNIN                  = 91
    SIGNUP                  = 92
    SIGNOUT                 = 93
    # normal bubble operations: 1xx
    FETCH_NORMAL            = 101
    FETCH_NORMALS           = 102
    GET_ROOT_BUBBLE         = 103
    CREATE_NORMAL           = 111
    EDIT_NORMAL             = 112
    UPDATE_FINISH_NORMAL    = 113
    UPDATE_DISCARD_NORMAL   = 114
    DELETE_NORMAL           = 115
    MOVE_NORMAL             = 116
    RELEASE_OWNERSHIP_NORMAL= 119
    WRAP_NORMAL             = 121
    POP_NORMAL              = 122
    SPLIT_LEAF              = 123
    SPLIT_INTERNAL          = 124
    FLATTEN_NORMAL          = 125
    MERGE_NORMAL            = 126 
    # suggest bubble operations: 2xx
    FETCH_SUGGEST           = 201
    FETCH_SUGGESTS          = 202
    CREATE_SUGGEST          = 211
    EDIT_SUGGEST            = 212
    HIDE_SUGGEST            = 213
    SHOW_SUGGEST            = 214
    VOTE_SUGGEST            = 215
    UNVOTE_SUGGEST          = 216
    SWITCH_SUGGEST          = 217
    # comment operations: 3xx
    FETCH_NCOMMENT          = 301
    FETCH_NCOMMENTS         = 302
    FETCH_SCOMMENT          = 305
    FETCH_SCOMMENTS         = 306
    CREATE_NCOMMENT         = 311
    EDIT_NCOMMENT           = 312
    DELETE_NCOMMENT         = 313
    CREATE_SCOMMENT         = 315
    EDIT_SCOMMENT           = 316
    DELETE_SCOMMENT         = 317
    # note operations: 4xx
    EXPORT_NOTE_TO_NORMAL   = 431
    EXPORT_NOTE_TO_SUGGEST  = 432
     
