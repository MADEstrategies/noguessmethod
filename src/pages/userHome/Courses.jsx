import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
const Courses = () => {
  return (
    <div className=''>
    <div class="layout">
  <aside class="sidebar">
    <div class="logo">NGM</div>
    <nav>
       <ul>
                       <li><input type="text" placeholder='Search' className='srch-bar'/></li>
                       
                       <li>
                         <Link to={'/workouts'}>Workouts</Link>
                         </li>
                       <li>
                         <Link to={'/courses'} className='Main-active'  >Courses</Link>
                         
                         </li>
                       <li>
                           <Link to={'/store'}  >Store</Link>
                       
                       </li>
               
                        <li>
                           <Link to={'/library'}  >Library</Link>
                       
                       </li>
                     </ul>
    </nav>
  </aside>

  <main class="content">
    <h2>Courses</h2>
    <div className='ContentSec'>

    <CourseCard/>
    <CourseCard tag='Free'/>
    <CourseCard tag='Free'/>
    <CourseCard tag='Free'/>
    <CourseCard tag='Free'/>
    <CourseCard/>

   
    <CourseCard tag='Free'/>
    </div>
  </main>
</div>

      
        
        </div>
  )
}

export default Courses;