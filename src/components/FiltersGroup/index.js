import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onRemoveFilters,
    onUpdateCategory,
    onUpdateRating,
  } = props

  const onClearFilters = () => {
    onRemoveFilters()
  }

  const DisplayRating = rating => {
    const {ratingDetails} = rating
    const {imageUrl, ratingId} = ratingDetails

    const onClickRating = () => {
      onUpdateRating(ratingId)
    }

    return (
      <li className="rating">
        <button
          className="category-button"
          type="button"
          onClick={onClickRating}
        >
          <img
            className="rating-image"
            src={imageUrl}
            alt={`rating ${ratingId}`}
          />
          & up
        </button>
      </li>
    )
  }

  const DisplayCategory = category => {
    const {eachCategory} = category
    const {name, categoryId} = eachCategory

    const onClickCategory = () => {
      onUpdateCategory(categoryId)
    }

    return (
      <li className="category-item">
        <button
          className="category-button"
          type="button"
          onClick={onClickCategory}
        >
          <p>{name}</p>
        </button>
      </li>
    )
  }

  return (
    <div className="filters-group-container">
      <div>
        <h1>Category</h1>
        <ul className="categories-container">
          {categoryOptions.map(eachCategory => (
            <DisplayCategory
              eachCategory={eachCategory}
              key={eachCategory.categoryId}
            />
          ))}
        </ul>
      </div>
      <div>
        <h1>Rating</h1>
        <ul>
          {ratingsList.map(eachRating => (
            <DisplayRating
              key={eachRating.ratingId}
              ratingDetails={eachRating}
            />
          ))}
        </ul>
      </div>
      <button
        className="clear-filters-button"
        type="button"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
