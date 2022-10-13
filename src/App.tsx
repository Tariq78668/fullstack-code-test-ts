import { useEffect, useState } from 'react';
import './App.css';
import { ServiceResult, UserModel } from './user.model';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {

  const [loadingText, setLoadingText] = useState("")
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [users, setUsers] = useState<ServiceResult<UserModel[]>>({
    data: [],
    page: 1,
    per_page: 6,
    total: 0,
    total_pages: 0
  });


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      fetchRecords();
    }, 3000)

  }, [])

  const fetchMoreData = () => {
    fetchRecords();
  }

  const fetchRecords = async () => {

    const pageNo = Math.ceil(users.data.length / users.per_page) + 1;

    const queryParam = "?page=" + pageNo;

    await fetch("https://reqres.in/api/users" + queryParam)
      .then(res => res.json())
      .then(
        (result: ServiceResult<UserModel[]>) => {

          const mergedData = [...users.data, ...result.data];
          result.data = mergedData;
          setUsers(result);
          if (result.total === mergedData.length) {
            setHasMore(false);
            setLoadingText("No more users");

          }
        },
        (error) => {

        }
      )
  }


  return (

    loading ? <div style={{ position: 'absolute', top: '50%', left: '50%' }}><div className="spinner-border" role="status"></div></div> :
      <div className="container">
        <div className="row">
          <div className='col-md-4 offset-md-4' style={{ margin: '0 auto' }}>
            <h3 className='text-center ' style={{background: '#ebeaea', padding: '22px'}}>Users</h3>
            <InfiniteScroll
              dataLength={users.data.length}
              next={fetchMoreData}
              hasMore={hasMore}
              height={500}
              loader={<div><h3>Loading...</h3></div>}
            >
              {users.data.map((i, index) => (
                <div>
                  <div className="card" key={i.id} style={{ flexDirection: 'row', textAlign: 'center', marginBottom: '10px', border: 'none' }}>
                    <img className="card-img-top rounded-circle" style={{ width: '17%' }} src={i.avatar} alt="Card image cap" />
                    <div className="card-body">
                      <h5 className="card-title">{i.first_name + " " + i.last_name}</h5>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </InfiniteScroll>
            <p>
              {loadingText}
            </p>

          </div>
        </div>


      </div>
  );
}

export default App;
