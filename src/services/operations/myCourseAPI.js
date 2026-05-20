// export const getCourseDetails=()=>{
//   return async(dispatch)=>{
//     const toastId=toast.loading("Loading...");
//     dispatch(setLoading(true));
//     try{
//       const response=await apiConnector();
//       console.log(response);

//     }
//     catch(err){
//       console.log(err);
//       console.log(err.message);
//       toast.error("");
//     }
//     toast.dismiss(toastId);
//     dispatch(setLoading(false));
//   }
// }