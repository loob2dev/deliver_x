export const get = async (url, param) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
        Authorization: 'Bearer ' + this.props.navigation.state.params.person_info.token,
      },
      body: JSON.stringify(param),
    });
    let responseJson = await response.json();
    if (responseJson.message) {
      throw responseJson.message;
    } else {
      return responseJson;
    }
  } catch (error) {
    throw { status: error };
  }
};

export const auth_get = async (url, token) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
        Authorization: 'Bearer ' + token,
      },
    });
    let responseJson = await response.json();
    if (responseJson.message) {
      throw responseJson.message;
    } else {
      return responseJson;
    }
  } catch (error) {
    throw { status: error };
  }
};

export const post = async (url, param) => {
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(param),
    });
    let responseJson = await response.json();
    if (responseJson.message) {
      throw responseJson.message;
    } else {
      return responseJson;
    }
  } catch (error) {
    throw { status: error };
  }
};

export const auth_post = async (url, token, param) => {
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(param),
    });
    let responseJson = await response.json();
    if (responseJson.message) {
      throw responseJson.message;
    } else {
      return responseJson;
    }
  } catch (error) {
    throw { status: error };
  }
};
