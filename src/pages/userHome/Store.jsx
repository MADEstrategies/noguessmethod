import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
const Store = () => {
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
                      <Link to={'/store'}  className='Main-active'>Store</Link>
                  
                  </li>
          
                   <li>
                      <Link to={'/library'}  >Library</Link>
                  
                  </li>
                </ul>
    </nav>
  </aside>

  <main class="content">
    <h2>Store</h2>
    <div className='Store-nav'>
        <img width={25} src="public/icons/mdi-light--cart (1).svg" alt="" />
    </div>
    <div className='ContentSec'>
        <div>
            <p>Store empty</p>
        </div>

    </div>
  </main>
</div>

      
        
        </div>
  )
}

export default Store;