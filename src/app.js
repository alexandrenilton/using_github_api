'use strict'

import React, { Component, PropTypes } from 'react'
import AppContent from './components/app-content'
import ajax from '@fdaciuk/ajax'
import { timingSafeEqual } from 'crypto';

class App extends Component {
  constructor () {
    super()
    this.state = {
      userinfo: null,
      repos: [],
      starred: [],
      isFetching: false
    }
  }

  getGitHubApiUrl (username, type){
    const internalUser = username ? `/${username}` : ''
    const internalType = type ? `/${type}` : ''
    return `https://api.github.com/users${internalUser}${internalType}`
  }

  handleSearch (e) {
    const value = e.target.value
    const keyCode = e.which || e.keyCode
    const ENTER = 13

    if (keyCode === ENTER) {
      this.setState({ isFetching: true })
      const URL = this.getGitHubApiUrl(value)
      ajax().get(URL)
        .then((result) => {
          // console.log(result)
          this.setState({
            userinfo: {
              username: result.name,
              photo: result.avatar_url,
              login: result.login,
              repos: result.public_repos,
              followers: result.followers,
              following: result.following,
            },
            repos: [],
            starred: []
          })
        })
        .always( () => this.setState({ isFetching: false }))
    }
  }

  getRepos (type) {
    return (e) => {
      const username = this.state.userinfo.login
      ajax().get(this.getGitHubApiUrl(username, type))
        .then((result) => {
          //console.log(URL, result)
          this.setState({
            [type]: result.map((repo) => ({
                name: repo.name,
                link: repo.html_url
            }))
          })
          console.log('this.state.repos', this.state.repos)
          console.log('this.state.starred', this.state.starred)
        })

      }
  }


  render () {
    return (
      <AppContent
        {...this.state}
        handleSearch={(e) => this.handleSearch(e)}
        getRepos={this.getRepos('repos')}
        getStarred={this.getRepos('starred')}
      />
    )
  }
}

AppContent.propTypes = {
  userinfo: PropTypes.object,
  repos: PropTypes.array.isRequired,
  starred: PropTypes.array.isRequired,
  isFetching: PropTypes.func.isRequired,
  getRepos: PropTypes.func.isRequired,
  getStarred: PropTypes.func.isRequired
}

export default App
