import React, { useState } from "react";
import { BsCamera, BsSearch } from "react-icons/bs";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { prepareSearching } from "../../../store/actions/ProductAction";
import { in_loading, out_loading } from "../../../utils/LoadingState";
import { loadPictureSearchProducts } from "../../../utils/Services";

const MobileSearchForm = (props) => {
  const { history } = props;
  const [search, setSearch] = useState("");

  const submitTextSearch = (e) => {
    e.preventDefault();
    history.push(`/search/${search}`);
  };

  const submitPictureSearch = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    if (selectedFile.name !== undefined) {
      in_loading();
      let formData = new FormData();
      formData.append("picture", selectedFile);
      loadPictureSearchProducts(formData).then((response) => {
        let picture = response.picture;
        let search_id = response.search_id;
        if (search_id && picture) {
          history.push(`/search/picture/${search_id}`);
        }
        out_loading();
      });
    }
  };

  return (
    <div className='container d-block'>
      <input
        type='file'
        accept='image/*'
        // accept='image/jpg,image/jpeg'
        onChange={(e) => submitPictureSearch(e)}
        name='picture'
        className='d-none'
        id='lg_picture_search'
      />

      <form className='search-border' onSubmit={(e) => submitTextSearch(e)} method='get'>
        <div className='input-group'>
          <div className='input-group-append'>
            <label
              className='btn btn-camera label_btn'
              style={{ marginLeft: ".1rem" }}
              htmlFor='lg_picture_search'
            >
              <BsCamera />
            </label>
          </div>
          <input
            type='text'
            id='search'
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search million product by photo or keywords'
            className='form-control'
          />
          <div className='input-group-append'>
            <button className='btn btn-search' type='submit'>
              <BsSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  search_products: state.PRODUCTS.search_products,
  picture_search_products: state.PRODUCTS.picture_search_products,
});

export default connect(mapStateToProps, { prepareSearching })(withRouter(MobileSearchForm));
