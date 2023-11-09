import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { loadSinglePage } from "../../store/actions/PageAction";
import { Link, withRouter } from "react-router-dom";
import { goPageTop } from "../../utils/Helpers";
import parser from "html-react-parser";
import My404Component from "../404/My404Component";

const SinglePage = (props) => {
  const { loading, pages, match } = props;
  const params = !_.isEmpty(match) ? match.params : {};
  const slug = !_.isEmpty(params) ? params.slug : "";
  const [page, setPage] = useState({});
  const [newLoad, setNewLoad] = useState(false);
  const [noPage, setNoPage] = useState(false);

  useEffect(() => {
    let identifier = {};
    if (!_.isEmpty(pages) && _.isArray(pages)) {
      identifier = pages.find((findPage) => findPage.post_slug === slug);
    }
    if (_.isEmpty(identifier)) {
      props.loadSinglePage(pages, slug);
    }
  }, [slug]);

  useEffect(() => {
    goPageTop();
  }, [page, slug, pages]);

  useEffect(() => {
    if (!_.isEmpty(pages) && _.isArray(pages)) {
      const identifier = pages.find((findPage) => findPage.post_slug === slug);
      if (!_.isEmpty(identifier)) {
        setPage(identifier);
        setNoPage(false);
        setNewLoad(false);
      } else {
        setNewLoad(true);
      }
    }
    if (!loading.isLoading && newLoad) {
      setNoPage(true);
    }
  });

  if (noPage) {
    return <My404Component />;
  }

  return (
    <main className='main'>
      <nav aria-label='breadcrumb' className='breadcrumb-nav border-0'>
        <div className='container'>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item'>
              <Link to='/'>Home</Link>
            </li>
            <li className='breadcrumb-item'>
              <span>Pages</span>
            </li>
            <li className='breadcrumb-item active' aria-current='page'>
              {page.post_title && parser(page.post_title)}
            </li>
          </ol>
        </div>
      </nav>
      <div className='page-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 mb-2 mb-lg-0'>
              <h2 className='title'>{page.post_title && parser(page.post_title)}</h2>
              <div className='mb-3 page-desc'>{page.post_content && parser(page.post_content)}</div>
            </div>
          </div>
          <hr className='mt-4 mb-5' />
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  loading: state.LOADING,
  pages: state.PAGE.singles,
});

export default connect(mapStateToProps, { loadSinglePage })(withRouter(SinglePage));
