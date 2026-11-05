//  basic axios

import axios from "axios";

const baseURL = "http://localhost:3000";
const getUser = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/v1/student/get/all`);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export default getUser;

// to get data
const [data, setData] = useState([]);
useEffect(() => {
  async function getData() {
    const res = await getUser();
    setData(res);
  }
  getData();
}, []);
useEffect(() => {
  console.log(data.students);
}, [data]);
