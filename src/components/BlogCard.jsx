import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css?family=Heebo:400,700|Open+Sans:400,700');

  :root {
    --color: #3c3163;
    --transition-time: 0.5s;
  }

  .blog-card {
    font-family: 'Heebo', sans-serif;
    --bg-filter-opacity: 0.5;
    background-image: 
    linear-gradient(
      rgba(0,0,0,var(--bg-filter-opacity)), 
      rgba(0,0,0,var(--bg-filter-opacity))
    ), 
    var(--bg-img);
    height: 20em;
    width: 15em;
    font-size: 1.5em;
    color: white;
    border-radius: 1em;
    padding: 1em;
    display: flex;
    align-items: flex-end;
    background-size: cover;
    background-position: center;
    box-shadow: 0 0 5em -1em black;
    transition: all var(--transition-time);
    position: relative;
    overflow: hidden;
    border: 10px solid #ccc;
    text-decoration: none;
    cursor: pointer;
  }

  .blog-card:hover {
    color: var(--color);
  }

  .blog-card h1 {
    margin: 0;
    font-size: 1.5em;
    line-height: 1.2em;
  }

  .blog-card p {
    font-size: 0.75em;
    font-family: 'Open Sans', sans-serif;
    margin-top: 0.5em;
    line-height: 2em;
  }

  .blog-card .tags {
    display: flex;
  }

  .blog-card .tags .tag {
    font-size: 0.75em;
    background: rgba(255,255,255,0.5);
    border-radius: 0.3rem;
    padding: 0 0.5em;
    margin-right: 0.5em;
    line-height: 1.5em;
    transition: all var(--transition-time);
  }

  .blog-card:hover .tags .tag {
    background: var(--color);
    color: white;
  }

  .blog-card .date {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.75em;
    padding: 1em;
    line-height: 1em;
    opacity: 0.8;
  }

  .blog-card:before,
  .blog-card:after {
    content: '';
    transform: scale(0);
    transform-origin: top left;
    border-radius: 50%;
    position: absolute;
    left: -50%;
    top: -50%;
    z-index: -5;
    transition: all var(--transition-time);
    transition-timing-function: ease-in-out;
  }

  .blog-card:before {
    background: #ddd;
    width: 250%;
    height: 250%;
  }

  .blog-card:after {
    background: white;
    width: 200%;
    height: 200%;
  }

  .blog-card:hover:before,
  .blog-card:hover:after {
    transform: scale(1);
  }

  .blog-card-grid-space .num {
    font-size: 3em;
    margin-bottom: 1.2rem;
    margin-left: 1rem;
    font-family: 'Heebo', sans-serif;
  }
`;

export default function BlogCard({
  num = "02",
  href = "",
  bgImg = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/basic-types-of-html-tags/cover.jpg",
  title = "Basic types of HTML tags",
  description = "Learn about some of the most common HTML tags…",
  date = "9 Oct 2017",
  tags = ["HTML"],
}) {
  return (
    <>
      <style>{styles}</style>
      <div className="blog-card-grid-space">
        <div className="num">{num}</div>
        <a
          className="blog-card"
          href={href}
          style={{ "--bg-img": `url('${bgImg}')` }}
        >
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="date">{date}</div>
            <div className="tags">
              {tags.map((tag) => (
                <div className="tag" key={tag}>{tag}</div>
              ))}
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
