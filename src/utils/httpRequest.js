export const get_no_response = async (url, token) => {
  try {
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (error) {
    throw { status: error };
  }
};

export const get = async url => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
    if (response.status !== 200) {
      throw 'Failed';
    }
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
    if (response.status !== 200) {
      throw 'Failed';
    }
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

export const auth_get_response = async (url, token) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
        Authorization: 'Bearer ' + token,
      },
    });
    return response;
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
    if (response.status !== 200) {
      throw 'Failed';
    }
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
    console.log(response);
    if (response.status !== 200) {
      throw 'Failed';
    }
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
