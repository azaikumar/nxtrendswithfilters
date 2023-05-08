import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatus = {
  inprogress: 'inprogress',
  success: 'success',
  failure: 'failure',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryFilterId: '',
    ratingFilterId: '',
    apiState: apiStatus.success,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      //   isLoading: true,
      apiState: apiStatus.inprogress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      categoryFilterId,
      ratingFilterId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${categoryFilterId}&rating=${ratingFilterId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))

      this.setState({
        productsList: updatedData,
        // isLoading: false,
        apiState: apiStatus.success,
      })
    } else {
      this.setState({
        apiState: apiStatus.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onEntered = () => {
    this.getProducts()
  }

  onClickCategory = id => {
    this.setState({categoryFilterId: id}, this.getProducts)
  }

  onClickRating = id => {
    this.setState({ratingFilterId: id}, this.getProducts)
  }

  onClickClearFilters = () => {
    this.setState(
      {
        searchInput: '',
        ratingFilterId: '',
        categoryFilterId: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View

    const lengthOfList = productsList.length

    return (
      <div className="all-products-container">
        {lengthOfList === 0 ? (
          this.noProductsView()
        ) : (
          <div>
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard
                  productData={product}
                  key={product.id}
                  productsList={productsList}
                  categoryOptions={categoryOptions}
                  ratingsList={ratingsList}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  failureView = () => (
    <div className="failure-img-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are facing some trouble processing your request. Please try again
      </p>
    </div>
  )

  noProductsView = () => (
    <div className="no-products-img-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products-img"
      />
      <p>We could not find any products. Try other filters.</p>
    </div>
  )

  renderProductsData = () => {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatus.success:
        return this.renderProductsList()
      case apiStatus.inprogress:
        return this.renderLoader()
      case apiStatus.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, ratingFilterId} = this.state

    console.log(ratingFilterId)
    return (
      <div className="all-products-section">
        {/* <ul className="category-item-container"> */}
        <div className="category-container">
          <FiltersGroup
            className="category-item"
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            onClickCategory={this.onClickCategory}
            onClickRating={this.onClickRating}
            onClickClearFilters={this.onClickClearFilters}
            searchInput={searchInput}
            onEntered={this.onEntered}
            onChangeSearchInput={this.onChangeSearchInput}
          />
        </div>
        {this.renderProductsData()}
      </div>
    )
  }
}

export default AllProductsSection
