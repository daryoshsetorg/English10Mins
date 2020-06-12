import Axios from 'axios'
import { MainLesson, MainLessons, SearchLessons, LikeLessons } from '../../utilities/url'
import DeviceInfo, { getDeviceId } from 'react-native-device-info'

const pageSize = 5;
var androidId = ''



export function getAll(params) {
    DeviceInfo.getAndroidId().then((id) => {
        androidId = id;
    });

    return Axios.get(MainLessons + "/" + params.index + "/" + pageSize).then((res) => {
        return res.data;
    }).catch(() => {
        return [];
    })

        ;
}

export function getLesson(params) {

    if (androidId != '') {
        return Axios.get(MainLesson + "/" + params.Id + "/" + params.Type + "/" + androidId).then((res) => {
            return res.data
        });
    }

}

export function searchLessons(params) {
    return Axios.get(SearchLessons + "/" + params.Title + "/" + params.PageIndex + "/" + pageSize).then((res) => {
        return res.data;
    });
}

export function likeLesson(params) {
    return Axios.get(LikeLessons + "/" + params.Id + "/" + androidId).then((res) => {
        return res.data
    });
}


