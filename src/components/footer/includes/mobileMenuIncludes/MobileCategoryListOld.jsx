import React from 'react';
import {NavLink} from "react-router-dom";
import {filter_children_cats, filter_parent_cats, loadAsset} from "../../../../utils/Helpers";


export const ParentListItem = (props) => {
   const {parent, categories} = props;

   const allChildren = filter_children_cats(categories, parent.otc_id);

   const children1 = (otc_id) => {
      return filter_children_cats(categories, otc_id);
   };

   if (allChildren.length > 0) {
      return <li key={parent.id}>
         <div className="menuBlock">
            <NavLink to={`/shop/${parent.slug}`}>
               {
                  parent.icon ?
                     <img src={loadAsset(parent.icon)}
                          style={{width: "22px", display: "inline", marginRight: "1rem"}}
                          alt={parent.name}/>
                     :
                     <i className="icon-laptop" style={{marginRight: "1rem"}}/>
               }
               <span className="btn_menu_close">{parent.name}</span>
            </NavLink>
            <span className="mmenu-btn"/>
         </div>
         <ul>
            {
               allChildren.map((child1, index) =>
                  <li key={'m_' + index}>
                     {child1.children_count ?
                        <>
                           <div className="menuBlock">
                              <NavLink to={`/shop/${child1.slug}`}>
                                    
                                 <span className="btn_menu_close"> {child1.name} </span>
                              </NavLink>
                              <span className="mmenu-btn"/>
                           </div>
                           <ul>
                              {
                                 children1(child1.otc_id).map((child2, index2) =>
                                    <li key={'mc_' + index2}>
                                       <NavLink to={`/shop/${child2.slug}`}>
                                          <span className="btn_menu_close">{child2.name}</span>
                                       </NavLink>
                                    </li>
                                 )
                              }
                           </ul>
                        </>
                        :
                        <NavLink to={`/${parent.slug}/${child1.slug}`}>
                           <span className="btn_menu_close">{child1.name}</span>
                        </NavLink>}
                  </li>
               )
            }
         </ul>
      </li>
   }

   return <li>
      <NavLink className="mobile-cats-lead" to={`/shop/${parent.slug}`}>
         {parent.name}
      </NavLink>
   </li>

};


const MobileCategoryList = (props) => {
   const {categories} = props;

   const parents = filter_parent_cats(categories);

   return (
      <nav className="mobile-nav">
         <ul className="mobile-menu">
            {
               parents.length > 0 &&
               parents.map((parent, index) => <ParentListItem key={"pm_" + index} parent={parent} categories={categories}/>)
            }
         </ul>
      </nav>
   );
};

export default MobileCategoryList;