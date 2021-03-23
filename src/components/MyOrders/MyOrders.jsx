import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'reactstrap'
import {fetchMyOrderList, fetchMyOrderDetails} from '../../state-management/user/asyncActions'
import LoadingBar from '../LoadingBar/LoadingBar'
import MyOrderDetails from '../MyOrderDetails/MyOrderDetails'
import './MyOrders.scss'
const MyOrders = React.memo(({restaurantId}) => {
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState({})
    const userState = useSelector((state)=>state.user)
    const menuState = useSelector((state)=>state.menu)
    const dispatch = useDispatch()
    const fetchOrders = async () =>{
        setLoading(true);
        const {payload} = await dispatch(fetchMyOrderList(userState.user.clientId));
        // console.log(payload.data)
        if(payload.status === '200') {
            const dataSource = payload.data.filter(
                (order) => order.restaurant_id === restaurantId
              )
              setOrders(dataSource);
              setLoading(false);

        }
    }
    
  
    useEffect(()=>{
        console.log("passed")
        fetchOrders()
    },[])

    return (
      <>
        <section
          className="parallax-window"
          data-parallax="scroll"
          // data-image-src="https://cutt.ly/Kkb7BY9"
          style={{
            background: `url('https://cutt.ly/Kkb7BY9') no-repeat center`,
            backgroundSize: "cover",
          }}
          data-natural-width={1400}
          data-natural-height={470}
        >
          <div id="subheader">
            <div id="sub_content">
              <div id="thumb">
                <img src={menuState.restaurantInfo.logo} alt />
              </div>
              {/* <div className="rating">
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star voted" />
              <i className="icon_star" /> (
              <small>
                <a href="detail_page_2.html">Read 98 reviews</a>
              </small>
              )
            </div> */}
              <h1>{menuState.restaurantInfo.rname}</h1>
              <div>
                <h1>Your Orders</h1>
              </div>
            </div>
            {/* End sub_content */}
          </div>
        </section>
        <div className="ordersContainer">
          {loading && <LoadingBar />}
          {console.log("orders", orderDetails)}
          <div className ="ordersContainer__ordersTable" >
            <Table striped responsive hover>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Order Date</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr> */}
                {orders.map((order) => {
                  return (
                    <tr key={order.order_id}>
                      <th>{order.order_id}</th>
                      <th>{order.order_date}</th>
                      <th>{order.paid === "0" ? "NO" : "YES"}</th>
                      <th>{order.order_status}</th>
                      <th
                        style={{cursor:"pointer"}}
                      >
                        <MyOrderDetails loading = {setLoading} orderId = {order.order_id} />
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    );
})

export default MyOrders
