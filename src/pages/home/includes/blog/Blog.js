import React from 'react'

const Blog = () => {
    return (
        <>
  <div className="blog-section bg-white py-2 pb-4">
    <div className="container">
      <div className="heading heading-flex">
        <div className="heading-left">
          <h2 className="title mb-0 font-weight-bold">From Our Blog</h2>
          {/* End .title */}
        </div>
        {/* End .heading-left */}
        <div className="heading-right">
          <a
            href="category.html"
            className="title-link font-size-normal text-uppercase font-weight-normal"
          >
            View More Posts
            <i className="icon-long-arrow-right" />
          </a>
        </div>
        {/* End .heading-right */}
      </div>
      <div
        className="owl-carousel owl-simple row cols-1 cols-sm-2 cols-lg-3 cols-xl-4"
        data-toggle="owl"
        data-owl-options='{
                      "nav": false, 
                      "dots": true,
                      "items": 3,
                      "margin": 20,
                      "loop": false,
                      "responsive": {
                          "0": {
                              "items":1
                          },
                          "576": {
                              "items":2
                          },
                          "992": {
                              "items":3
                          },
                          "1200": {
                              "items":4
                          }
                      }
                  }'
      >
        <article className="entry blog-overlay">
          <figure className="entry-media">
            <a href="#!">
              <img
                src="assets/images/demos/demo-20/blog/post-1.jpg"
                alt="image desc"
                width={335}
                height={200}
              />
            </a>
          </figure>
          {/* End .entry-media */}
          <div className="entry-body">
            <div className="entry-meta font-size-normal">
              <a href="#!">Nov 22, 2018</a>, 0 Comments
            </div>
            {/* End .entry-meta font-size-normal */}
            <h3 className="entry-title my-4 mt-0">
              <a href="#!">Aenean dignissim felis.</a>
            </h3>
            {/* End .entry-title */}
            <div className="entry-content">
              <p className="font-weight-normal mb-1">
                Morbi in sem quis dui placerat ornare. Pelle ntesque odio nisi,
                euismod in, pharetra ultricies in, diam. Sed arcu.{" "}
              </p>
            </div>
            {/* End .entry-content */}
          </div>
          {/* End .entry-body */}
        </article>
        {/* End .entry */}
        <article className="entry blog-overlay">
          <figure className="entry-media">
            <a href="#!">
              <img
                src="assets/images/demos/demo-26/blog/post-1.jpg"
                alt="image desc"
                width={335}
                height={200}
              />
            </a>
          </figure>
          {/* End .entry-media */}
          <div className="entry-body">
            <div className="entry-meta font-size-normal">
              <a href="#!">Nov 22, 2018</a>, 0 Comments
            </div>
            {/* End .entry-meta font-size-normal */}
            <h3 className="entry-title my-4 mt-0">
              <a href="#!">Cras ornare tristique elit.</a>
            </h3>
            {/* End .entry-title */}
            <div className="entry-content">
              <p className="font-weight-normal mb-1">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec
                odio. Quisque volutpat mattis eros.{" "}
              </p>
            </div>
            {/* End .entry-content */}
          </div>
          {/* End .entry-body */}
        </article>
        {/* End .entry */}
        <article className="entry blog-overlay">
          <figure className="entry-media">
            <a href="#!">
              <img
                src="assets/images/demos/demo-26/blog/post-2.jpg"
                alt="image desc"
                width={335}
                height={200}
              />
            </a>
          </figure>
          {/* End .entry-media */}
          <div className="entry-body">
            <div className="entry-meta font-size-normal">
              <a href="#!">Nov 22, 2018</a>, 0 Comments
            </div>
            {/* End .entry-meta font-size-normal */}
            <h3 className="entry-title my-4 mt-0">
              <a href="#!">Vestibulum auctor dapibus neque.</a>
            </h3>
            {/* End .entry-title */}
            <div className="entry-content">
              <p className="font-weight-normal mb-1">
                Quisque volutpat mattis eros. Nullam malesu erat ut turpis.
                Suspendisse urna nibh, viverra non, semper suscipit, posuere a,
                pede.
              </p>
            </div>
            {/* End .entry-content */}
          </div>
          {/* End .entry-body */}
        </article>
        {/* End .entry */}
        <article className="entry blog-overlay">
          <figure className="entry-media">
            <a href="#!">
              <img
                src="assets/images/demos/demo-26/blog/post-3.jpg"
                alt="image desc"
                width={335}
                height={200}
              />
            </a>
          </figure>
          {/* End .entry-media */}
          <div className="entry-body">
            <div className="entry-meta font-size-normal">
              <a href="#!">Nov 22, 2018</a>, 0 Comments
            </div>
            {/* End .entry-meta font-size-normal */}
            <h3 className="entry-title my-4 mt-0">
              <a href="#!">Cras iaculis ultricies nulla.</a>
            </h3>
            {/* End .entry-title */}
            <div className="entry-content">
              <p className="font-weight-normal mb-1">
                Suspendisse urna nibh, viverra non, semper suscipit, posuere a,
                pede. Donec nec justo eget felis facilisis fermentum.{" "}
              </p>
            </div>
            {/* End .entry-content */}
          </div>
          {/* End .entry-body */}
        </article>
        {/* End .entry */}
      </div>
      {/* End .owl-carousel */}
    </div>
    {/* End .container */}
    <div className="mb-lg-5" />
  </div>
  {/* End .blog-posts */}
</>

    )
}

export default Blog
