import Axios from 'axios'
import { MainLesson, MainLessons, SearchLessons, LikeLessons } from '../../utilities/url'
import DeviceInfo, { getDeviceId } from 'react-native-device-info'

const pageSize = 5;
var androidId = ''

export function getAll(params) {
    let returnList = []
    return Axios.get(MainLessons + "/" + params.index + "/" + pageSize).then((d) => {

        d.data.forEach(element => {
            returnList.push({ Id: element.Id, Title: element.Title, ImageUrl: element.Id + '.jpg' })
        });

        return returnList;
    });
}

export function getLesson(params) {

    DeviceInfo.getAndroidId().then((d) => {
        androidId = d;
    });

    return Axios.get(MainLesson + "/" + params.Id + "/" + params.Type + "/" + androidId).then((res) => {
        return res.data
    });
}

export function searchLessons(params) {
    console.log(params)
    let returnList = [];
    return Axios.get(SearchLessons + "/" + params.Title + "/" + params.PageIndex + "/" + pageSize).then((res) => {

        if (res.data.length > 0) {
            res.data.forEach(element => {
                returnList.push({ Id: element.Id, Title: element.Title, ImageUrl: element.Id + '.jpg' })
            });
        }
        return returnList;
    });
}

export function likeLesson(params) {
    if (params.IsLike) {
        return Axios.get(LikeLessons + "/" + params.Id + "/" + params.AndroidId).then((res) => {
            return res.data
        });
    } else {
        return Axios.get(LikeLessons + "/" + params.Id).then((res) => {
            return res.data
        });
    }
}


