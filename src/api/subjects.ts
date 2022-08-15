import http from '@/utils/http';

export function addSubjects(data: { name: string; logo: string }) {
  return http({
    url: '/subjects',
    method: 'post',
    data,
  });
}
export function mySubjects() {
  return http('/subjects/mine');
}
export function delMySubject(id: number) {
  return http.delete(`/subjects/mine/${id}`);
}

export function getMembers(id: number) {
  return http(`/subjects/joined/${id}/members`);
}
export function joined() {
  return http('/subjects/joined');
}
export function invitations(page = 0, size = 20) {
  return http({
    url: '/subjects/invitations',
    method: 'get',
    params: {
      page,
      size,
    },
  });
}
export function reply(id: number, accept: string) {
  return http({
    url: `/subjects/invitations/${id}/reply`,
    method: 'post',
    params: {
      id,
      accept,
    },
  });
}
export function invite(id: number, member: number) {
  return http({
    url: `/subjects/mine/${id}/invite`,
    method: 'post',
    params: {
      id,
      member,
    },
  });
}
export function exitSubject(id: number) {
  return http({
    url: `/subjects/joined/${id}`,
    method: 'delete',
  });
}
export function deleteSubject(id: number) {
  return http({
    url: `/subjects/mine/${id}`,
    method: 'delete',
  });
}
