import { axiosReq } from "../api/axiosDefaults"

export const fetchMoreData = async (resourse, setResourse) => {
    try {
        const {data} = await axiosReq.get(resourse.next)
        setResourse(prevResourse => ({
            ...prevResourse,
            next:data.next,
            results: data.results.reduce((acc, cur) => {
                return acc.some(accResult => accResult.id === cur.id) ? acc : [...acc, cur];
            }, prevResourse.results)
        }))
    } catch(err) {

    }
};

export const followHelper = (profile, clickedProfile, following_id) => {
    return profile.id === clickedProfile.id
    ?
    {
      ...profile,
      followers_count: profile.followers_count + 1,
      following_id,
    }
    : profile.is_owner
    ?
    {
      ...profile, followers_count: profile.followers_count + 1
    }
    :
    profile;
  };