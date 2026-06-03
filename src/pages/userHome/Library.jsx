import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
const Library = () => {
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
                    <Link to={'/courses'}  >Courses</Link>
                    
                    </li>
                  <li>
                      <Link to={'/store'}  >Store</Link>
                  
                  </li>
          
                   <li>
                      <Link to={'/library'} className='Main-active' >Library</Link>
                  
                  </li>
                </ul>
    </nav>
  </aside>

  <main class="content">
    <h2>Library</h2>
    <div className='ContentSec'>
      {/*   <div>
            <p>Nothing in you library</p>
        </div> */}

        <CourseCard tag='Completed'/>
        <CourseCard tag='Inprogress'/>
        <CourseCard tag='Inprogress'/>
        <CourseCard tag='Inprogress'/>
        <CourseCard tag='Inprogress'/> 
        <CourseCard tag='Inprogress'/> 

    </div>
  </main>
</div>

      
        
        </div>
  )
}

export default Library;