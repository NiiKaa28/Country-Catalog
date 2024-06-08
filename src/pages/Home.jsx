import React ,{ useState, useEffect } from "react"
import axios from "axios";
import Modal from 'react-modal';
function Home() {
    const [country, setCountry] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [filteredPages, setFilteredPages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);


    useEffect(() => {
        axios.get(' https://restcountries.com/v3.1/all')
        .then(response => {
            if(response){
                localStorage.restcountries = JSON.stringify(response);
                if (localStorage.restcountries) {
                    const data = JSON.parse(localStorage.restcountries);
                    
                    if(data){
                        const sortedData = data.data.sort((a, b) => {
                            if (sortOrder === 'asc') {
                                return a.name.common.localeCompare(b.name.common);
                            } else {
                                return b.name.common.localeCompare(a.name.common);
                            }
                        });
                        setCountry(sortedData);
                        console.log(data?.data,'ddd');
                        setFilteredItems(data?.data)
                        setFilteredPages(data?.data.slice(0, itemsPerPage));
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [sortOrder]);

 
    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = country.filter((item) =>
            item.name.official.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Search query:", searchQuery);
        const filtered = country.filter((item) =>
            item.name.official.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setFilteredPages(country.slice(startIndex, endIndex));
    };

    const handleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    const handleData = async (data) => {
        setData(data);
        setModalIsOpen(true);
        console.log(data, 'data');
    }
    
    function closeModal() {
        setModalIsOpen(false);
    }
    return (
        <>
            <div className="container mx-auto">
                <div>
                    <h1 className="font-bold text-gray-900 dark:text-dark text-4xl">
                        Countries Catalog
                    </h1>
                </div>
                <div className="mt-16 mb-3 xl:w-96">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch flex items-center justify-between ">
                        <div className="flex">
                            <form  onSubmit={handleSubmit}>
                                <input
                                    className="w-80 py-3 px-4 outline-none border border-solid border-neutral-300 shadow rounded text-gray-600 dark:text-gray-400 dark:bg-light-800 dark:focus:bg-light-700"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    />
                            </form>
                            <span
                                className="input-group-text flex items-center whitespace-nowrap rounded px-2 py-1.5 text-center text-base font-normal border border-solid border-neutral-300 text-neutral-300 dark:text-neutral-800"
                                id="basic-addon2">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"className="h-5 w-5">
                                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={handleSort}>Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}</button>
                    </div>
                </div>
            </div>
           
            <div className="container mx-auto grid grid-cols-4 gap-4 mt-16">
            {searchQuery === "" ? (
                filteredPages.map((item,index) => (
                    <div className="max-w-xs mb-5 rounded overflow-hidden shadow-lg country-img" key={index}>
                        <img src={item.flags['png']}  alt= {`${item.name['official']} flags`}  className="w-full"/> 
                        <div className="p-2">
                            <div className="font-bold text-start text-md mb-2 px-2" style={{ cursor: 'pointer' }} onClick={() => handleData(item)}>
                                {item.name['official']}
                            </div>
                            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal" ariaHideApp={false}>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={closeModal}>Close</button>
                                <div className="container grid grid-cols-2 mt-5">
                                    <div className="col-span-1">
                                        <img src={data?.flags?.png}  alt= {`${data?.name?.official} flags`}  className="details-flag"/> 
                                    </div>
                                    <div className="font-bold">
                                        <span>Country Name: {data?.name?.official}</span><br></br>
                                        <span>Country Code: {data?.idd?.suffixes}</span><br></br>
                                        <span>CCA2: {data?.cca2} , CCA3: {data?.cca3} , CCN3: {data?.ccn3} , CIOC: {data?.cioc}</span><br></br>
                                        <span>Alternative: {data?.altSpellings?.['1']}</span><br></br>
                                        <span>Area: {data?.area}</span><br></br>
                                        <span>Capital: {data?.capital} (LatLng: {data?.capitalInfo?.latlng?.['0']},{data?.capitalInfo?.latlng?.['1']})</span><br></br>
                                        <span>Continent: {data?.continents}</span><br></br>
                                        <span>Maps: {data?.maps?.googleMaps}</span><br></br>
                                        <span>Borders: {data?.borders?.['0']},{data?.borders?.['1']},{data?.borders?.['2']},{data?.borders?.['3']}</span><br></br>
                                    </div>
                                </div>
                            </Modal>
                            <p className="text-xs text-gray-700 text-base text-start px-2">CCA2: {item.cca2}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">CCA3: {item.cca3}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">Native Name:{item?.name?.nativeName?.prs?.official}</p>
                            {/* <p className="text-xs text-gray-700 text-base text-start px-2">Native Name:{console.log(item?.name?.nativeName?.prs?.official,'nt')}</p> */}
                            <p className="text-xs text-gray-700 text-base text-start px-2">Alternative: {item.altSpellings['1']}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">Code: {item.idd['suffixes']}</p>
                        </div>
                    </div>
                ))
            ) : filteredItems.length > 0 ? (
                filteredItems.map((item,index) => (
                    <div className="max-w-xs mb-5 rounded overflow-hidden shadow-lg country-img" key={index}>
                        <img src={item.flags['png']}  alt= {`${item.name['official']} flags`}  className="w-full"/> 
                        <div className="p-2">
                            <div className="font-bold text-start text-md mb-2 px-2" style={{ cursor: 'pointer' }} onClick={() => handleData(item)}>
                                {item.name['official']}
                            </div>
                            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal" ariaHideApp={false}>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={closeModal}>Close</button>
                                <div className="container grid grid-cols-2 mt-5">
                                    <div className="col-span-1">
                                        <img src={data?.flags?.png}  alt= {`${data?.name?.official} flags`}  className="details-flag"/> 
                                    </div>
                                    <div className="font-bold">
                                        <span>Country Name: {data?.name?.official}</span><br></br>
                                        <span>Country Code: {data?.idd?.suffixes}</span><br></br>
                                        <span>CCA2: {data?.cca2} , CCA3: {data?.cca3} , CCN3: {data?.ccn3} , CIOC: {data?.cioc}</span><br></br>
                                        <span>Alternative: {data?.altSpellings?.['1']}</span><br></br>
                                        <span>Area: {data?.area}</span><br></br>
                                        <span>Capital: {data?.capital} (LatLng: {data?.capitalInfo?.latlng?.['0']},{data?.capitalInfo?.latlng?.['1']})</span><br></br>
                                        <span>Continent: {data?.continents}</span><br></br>
                                        <span>Maps: {data?.maps?.googleMaps}</span><br></br>
                                        <span>Borders: {data?.borders?.['0']},{data?.borders?.['1']},{data?.borders?.['2']},{data?.borders?.['3']}</span><br></br>
                                    </div>
                                </div>
                            </Modal>
                            <p className="text-xs text-gray-700 text-base text-start px-2">CCA2: {item.cca2}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">CCA3: {item.cca3}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">Native Name:{item?.name?.nativeName?.prs?.official}</p>
                            {/* <p className="text-xs text-gray-700 text-base text-start px-2">Native Name:{console.log(item?.name?.nativeName?.prs?.official,'nt')}</p> */}
                            <p className="text-xs text-gray-700 text-base text-start px-2">Alternative: {item.altSpellings['1']}</p>
                            <p className="text-xs text-gray-700 text-base text-start px-2">Code: {item.idd['suffixes']}</p>
                        </div>
                    </div>
                ))
            ) : (
                <li>No matching items found</li>
            )}
            </div>
            <div className="container mx-auto flex justify-end mt-5">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"  onClick={() => paginate(currentPage - 1)}>
                    Prev
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"  onClick={() => paginate(currentPage + 1)}>
                    Next
                </button>
            </div>
        </>
    );
};

export default Home;