import React, { useEffect } from 'react';
import IndexNav from "./indexNav";
import {useSelector} from "react-redux"; 
import TopicsList from '../../component/topicslist';
import { useTopicsList } from '../../store/action';
import qs from "qs";
import { useLocation } from 'react-router-dom';
import IndexPagination from './indexPagination';
function IndexPage() {
  let {data,loading} = useSelector(state=>state.topics);
  let getData = useTopicsList();
  let {search} = useLocation();
  let {tab="all",page=1} = qs.parse(search.substr(1));
  useEffect(()=>{
    getData(tab,page);
  },[tab,page])
  return (<div style={{marginTop:10}}>
        <IndexNav />
        <TopicsList 
            data={data}
            loading={loading}
        />
        {loading?"":<IndexPagination />}
  </div>);
}

export default IndexPage;
