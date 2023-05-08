import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    onClickCategory,
    ratingsList,
    onClickRating,
    onClickClearFilters,
    searchInput,
    onEntered,
    onChangeSearchInput,
  } = props
  //   const {categoryId} = categoryOptions

  //   const {ratingId} = ratingsList

  //   const onClickCategoryItem = () => {
  //     onClickCategory(categoryId)
  //   }

  //   const onClickRatingItem = () => {
  //     onClickRating(ratingId)
  //   }
  const handleEnterKey = event => {
    if (event.key === 'Enter') {
      onEntered()
    }
  }
  const onClickFilterButton = () => {
    onClickClearFilters()
  }

  return (
    <li className="filters-group-container">
      <div className="category-container">
        <div className="search-bar">
          <input
            type="search"
            placeholder="search"
            className="search-input"
            onChange={e => onChangeSearchInput(e)}
            value={searchInput}
            onKeyDown={e => handleEnterKey(e)}
          />
          <BsSearch className="search-icon" />
        </div>
        <h1 className="category-name">Category</h1>
        {categoryOptions.map(eachItem => (
          <button
            type="button"
            className="category-name-item"
            onClick={() => onClickCategory(eachItem.categoryId)}
            key={eachItem.categoryId}
          >
            <p>{eachItem.name}</p>
          </button>
        ))}
      </div>
      <h1 className="category-name">Rating</h1>
      <div className="rating-item-container">
        {ratingsList.map(eachItem => (
          <button
            type="button"
            className="rating-and-text"
            onClick={() => onClickRating(eachItem.ratingId)}
            key={eachItem.ratingId}
          >
            <img
              src={eachItem.imageUrl}
              alt={`rating ${eachItem.ratingId}`}
              //   key={eachItem.ratingId}
              className="rating-stars-img"
            />
            <p>& up</p>
          </button>
        ))}
        <button
          type="button"
          className="clear-btn"
          onClick={onClickFilterButton}
        >
          Clear Filters
        </button>
      </div>
    </li>
  )
}

export default FiltersGroup
