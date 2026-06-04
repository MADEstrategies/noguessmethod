import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard'
import BlogCard from '../../components/BlogCard';
const Workouts = () => {
  return (
    <div className=''>
    <div class="layout">
  <aside class="sidebar">
    <div class="logo">NGM</div>
    <nav>
        <ul>
              <li><input type="text" placeholder='Search' className='srch-bar'/></li>
              
              <li>
                <Link to={'/workouts'} className='Main-active'>Workouts</Link>
                </li>
              <li>
                <Link to={'/courses'}  >Courses</Link>
                
                </li>
              <li>
                  <Link to={'/store'}>Store</Link>
              
              </li>
      
               <li>
                  <Link to={'/library'}  >Library</Link>
              
              </li>
            </ul>
    </nav>
  </aside>

  <main class="content">
    <h2>
        Workouts
    </h2>
    <div className='ContentSec'>

    <BlogCard title='Chest' num='01' date='Inprogress' bgImg='/assets/pexels-emre-varisli-506660537-28902616.jpg'/>
    <BlogCard title='Triceps' date='Inprogress' bgImg='/assets/pexels-marcuschanmedia-17898141.jpg'/>
    <BlogCard title='Abs' date='Inprogress' bgImg='/assets/pexels-gu-ko-2150570603-35376434.jpg' num='03'/>
    </div>
  </main>
</div>

      
        
        </div>
  )
}

export default Workouts;
