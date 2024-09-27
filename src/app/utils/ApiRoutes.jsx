const ApiRoutes = {
  SENDOTP : {
    path : '/app/api/sendOtp',
    authenticate : false
  },
  REGISTER:{
    path : '/src/app/api/auth/register/route',
    authenticate : false
  },
  VERIFYOTP : {
    path : '/app/api/verifyOtp',
    authenticate : false
  },
  
  GOOGLELOGIN : {
    path : '/googlelogin/success',
    authenticate : false
  },
  GOOGLELOGOUT : {
    path : '/googlelogout',
    authenticate : true
  },
  USER : {
    path : '/src/app/api/user',
    authenticate : true
  },
  TASK : {
    path : '/src/app/api/tasks',
    authenticate : true
  },
  AUTH : {
    path : 'api/auth/login',
    authenticate : false
  },
  ADDPROJECT : {
    path : '/api/project/general',
    authenticate : true
  },
  UPDATEPROJECT : {
    path : '/api/project/nested',
    authenticate : true
  },
  GETPROJECTSLIST : {
    path : '/api/project/general',
    authenticate : true
  },
  GETCURRENTPROJECTCARDDATA : {
    path : '/api/project/nested',
    authenticate : true
  },
  DELETECURRENTPROJECT : {
    path : '/api/project/nested',
    authenticate : true
  },
}

export default ApiRoutes