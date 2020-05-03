import Axios from 'axios'
import { MainLesson, MainLessons,SearchLessons } from '../../utilities/url'

export function getAll(params) {
    let returnList = []
    return Axios.get(MainLessons + "/" + params.index).then((d) => {

        d.data.forEach(element => {
            returnList.push({ Id: element.Id, Title: element.Title, ImageUrl: element.Id + '.jpg' })
        });

        return returnList;
    });
}

export function getLesson(params)
{
    return Axios.get(MainLesson + "/" + params.Id).then((res) => {
            return res.data
    });
}

export function searchLessons(params){
    return Axios.get(SearchLessons + "/" + params.Id).then((res) => {
        return res.data
});
}
