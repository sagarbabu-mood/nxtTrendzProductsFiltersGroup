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

const apiConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: apiConstants.inProgress,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  searchProducts = event => {
    this.setState({searchInput: event.target.value})
    if (event.key === 'Enter') {
      this.setState({isLoading: apiConstants.inProgress}, this.getProducts)
    }
  }

  getProducts = async () => {
    this.setState({
      isLoading: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, rating, category, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${searchInput}&rating=${rating}`

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
        isLoading: apiConstants.success,
      })
    } else {
      this.setState({isLoading: apiConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, isLoading} = this.state
    // TODO: Add No Products View

    const onSuccess = () => (
      <>
        <div className="all-products-container">
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
            searchProducts={this.searchProducts}
          />
          {productsList.length === 0 ? (
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
                alt="no products"
              />
              <h1>No Products Found</h1>
              <p>We could not find any products. Try other filters.</p>
            </div>
          ) : (
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          )}
        </div>
      </>
    )

    switch (isLoading) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return onSuccess()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong </h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  onRemoveFilters = () => {
    this.setState(
      {
        isLoading: apiConstants.inProgress,
        activeOptionId: sortbyOptions[0].optionId,
        searchInput: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  onUpdateCategory = category => {
    this.setState({category}, this.getProducts)
  }

  onUpdateRating = rating => {
    this.setState({rating}, this.getProducts)
  }

  // TODO: Add failure view

  renderItem = () => {
    const {isLoading} = this.state
    switch (isLoading) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderProductsList()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onRemoveFilters={this.onRemoveFilters}
          onUpdateCategory={this.onUpdateCategory}
          onUpdateRating={this.onUpdateRating}
        />

        {this.renderItem()}
      </div>
    )
  }
}

export default AllProductsSection
