import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../common/IconBtn";
import { MdSpaceDashboard } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import { useState } from "react";

const ProfileDropDown=()=>{
  const {user}=useSelector((state)=>state.profile);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [open,setOpen]=useState(false);
  return (
    <div className="relative">
      
      
      <button
        type="button"
        onClick={()=>setOpen((current)=>!current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-richblack-600 bg-richblack-800 p-0"
        aria-label="Open profile menu"
      >
        <img src={user?.image} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
      </button>



      {open && (
      <div className="absolute right-0 top-12 z-[1000] flex w-44 flex-col rounded-md border border-richblack-500 bg-richblack-700 px-3 py-3 text-white shadow-xl">
          <IconBtn
          onclick={()=>{
            setOpen(false);
            navigate("/dashboard/my-profile");
          }}
          text="Dashboard"
          children={<MdSpaceDashboard   fontSize={20} />}
          customClasses="flex gap-2 justify-center w-full align-middle flex-row-reverse"
          /> 
          <IconBtn
          onclick={()=>{
            setOpen(false);
            dispatch(logout(navigate));
          }}
          text="Logout"
          children={<RiLogoutBoxLine fontSize={20} />    }
          customClasses="flex mt-2 gap-2 justify-center w-full align-middle flex-row-reverse"
          /> 
          <div className="absolute -top-[9px] right-4 z-50 h-4 w-4 rotate-45 rounded-sm border-l border-t border-richblack-500 bg-richblack-700"></div>
      </div>
      )}


    </div>
  )
}

export default ProfileDropDown;
