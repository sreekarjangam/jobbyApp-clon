import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileData: {},
    search: '',
    employmentType: '',
    minimumPackage: '',
    jobsApiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: profile,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {search, employmentType, minimumPackage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedJobs = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: formattedJobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryJobs = () => {
    this.getJobs()
  }

  onClickRetryProfile = () => {
    this.getProfile()
  }

  onChangeSearch = e => {
    this.setState({search: e.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = e => {
    this.setState({employmentType: e.target.value}, this.getJobs)
  }

  onChangeSalaryRange = e => {
    this.setState({minimumPackage: e.target.value}, this.getJobs)
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader" />
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoader()
      default:
        return null
    }
  }

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li key={job.id} className="job-item">
            <img
              src={job.companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <h1 className="job-title">{job.title}</h1>
            <p className="job-rating">{job.rating}</p>
            <p className="job-location">{job.location}</p>
            <p className="job-employment-type">{job.employmentType}</p>
            <p className="job-package">{job.packagePerAnnum}</p>
            <h1 className="description-heading">Description</h1>
            <p className="job-description">{job.jobDescription}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsLoader = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader" />
    </div>
  )

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccess()
      case apiStatusConstants.failure:
        return this.renderJobsFailure()
      case apiStatusConstants.inProgress:
        return this.renderJobsLoader()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          {/* Sidebar */}
          <div className="sidebar">
            {this.renderProfile()}

            <h1>Type of Employment</h1>
            <ul className="employment-type-list">
              {employmentTypesList.map(item => (
                <li key={item.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={item.employmentTypeId}
                    value={item.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              ))}
            </ul>

            <h1>Salary Range</h1>
            <ul className="salary-range-list">
              {salaryRangesList.map(item => (
                <li key={item.salaryRangeId}>
                  <input
                    type="radio"
                    id={item.salaryRangeId}
                    name="salary"
                    value={item.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label htmlFor={item.salaryRangeId}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* Main content */}
          <div className="jobs-main-content">
            <div className="search-container">
              <input
                type="search"
                value={search}
                placeholder="Search"
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                Search
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs