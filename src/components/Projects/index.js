import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const getFormattedData = data => ({
  id: data.id,
  name: data.name,
  imageUrl: data.image_url,
})

class Projects extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  onChangeOption = event => {
    this.setState({activeCategoryId: event.target.value}, this.getProjectList)
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategoryId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const formattedDate = data.projects.map(each => getFormattedData(each))
      this.setState({
        projectsList: formattedDate,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNavbar = () => (
    <nav>
      <div className="sub-nav-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </div>
    </nav>
  )

  renderProjectItems = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list">
        {projectsList.map(each => (
          <ProjectItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" width={50} height={50} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-btn"
        onClick={() => this.getProjectList()}
      >
        Retry
      </button>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectItems()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <div className="main-container">
        {this.renderNavbar()}
        <div className="sub-container">
          <select value={activeCategoryId} onChange={this.onChangeOption}>
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderViews()}
        </div>
      </div>
    )
  }
}

export default Projects
