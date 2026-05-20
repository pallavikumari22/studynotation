import { useState } from 'react';
import { useSelector } from 'react-redux';
import {COURSE_STATUS} from "../../../../utils/constants";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import {  useNavigate } from 'react-router-dom';
import ConfirmationModal from "../../../common/ConfirmationModal";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';


export default function CoursesTable({courses,setCourses}){
  
  const {token}=useSelector((state)=>state.auth);
  const [loading,setLoading]=useState(false);
  const [confirmationModal,setConfirmationModal]=useState(null);

  const handleCourseDelete=async(courseId)=>{
    setLoading(true);
 
    await deleteCourse({
      courseId:courseId
    },token);
    const result=await fetchInstructorCourses(token);
    if(result){
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  }

  const navigate=useNavigate();


  return (
    <div className='overflow-x-auto text-white'>
      <Table>
        <Thead>
          <Tr className="grid min-w-[760px] grid-cols-[minmax(300px,1fr)_120px_120px_100px] gap-4 border-richblack-800 p-5">
            <Th>
              Courses
            </Th>  
            <Th>
              Duration
            </Th>  
            <Th>
              Prices
            </Th>  
            <Th>
              Actions
            </Th>  
          </Tr>  
          
        </Thead> 

        <Tbody>
          {
            courses.length===0? 
            (
              <Tr>

                <Td>
                  No Courses Found
                </Td>
              </Tr>


            ) 
            :(
              
              courses?.map((course)=>(
                <Tr className="grid min-w-[760px] grid-cols-[minmax(300px,1fr)_120px_120px_100px] gap-4 border-richblack-800 p-5"
                key={course?._id}>
                    <Td className="flex gap-4">
<img src={course?.thumbnail} 
                       alt={course?.courseName}
                       className='h-[120px] w-[180px] shrink-0 rounded-lg object-cover'
                       />
                      <div className='flex min-w-0 flex-col'>
                        <p className="font-semibold">{course?.courseName}</p>
                        <p className="line-clamp-3 text-sm text-richblack-300">{course?.courseDescription}</p>
                        <p>Created:</p>
                        {
                          course.status===COURSE_STATUS.DRAFT ? (
                            <p className='text-pink-300'>

                              DRAFTED
                            </p>
                          ): (
                            <p className='text-yellow-300'>PUBLISHED </p>
                          )

                        }
                      </div>
                    </Td>   
                    <Td >
                        2 hr 30 min
                      
                    </Td>          
                    <Td>
                    {course?.price}  
                    </Td>

                    <Td>
                        <button
                        disabled={loading}
                        onClick={()=>navigate(`/dashboard/edit-course/${course._id}`)}
                        >
                          <MdEdit/>
                        </button>
                        <button
                        disabled={loading}
                        onClick={()=>setConfirmationModal({
                          text1:"Do you want to delete this course?",
                          text2:"All the data related to this course will be deleted",
                          btn1Text:"Delete",
                          btn2Text:"Cancel",
                          btn1Handler:!loading? (()=>handleCourseDelete(course._id)):(()=>{}),
                          btn2Handler:!loading?(()=>setConfirmationModal(null)):(()=>{}),

                        })}
                        
                        >
                          <MdDelete/>
                        </button>
                    </Td>    


                </Tr>


              ))


            )
          }
        </Tbody> 
        
        
      </Table>  
          {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>  }
    </div>
  )
}
