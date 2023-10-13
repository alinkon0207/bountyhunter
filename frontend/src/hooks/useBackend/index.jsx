import axios from 'axios';
import {BountyStatus, WorkStatus} from '../../contexts/ContractContext';

const useBackend = () => {
    // const BACKEND_URL = 'https://sorobounty-6345876ced42.herokuapp.com/api/bounty/';
    // const BACKEND_URL = 'https://bounty.cryptosnowprince.com/api/bounty/';
    const BACKEND_URL = 'http://localhost:8888/api/bounty/';

    const getUser = async (wallet) => {
        let name = '';
        let github = '';
        let discord = '';
        let image = '';

        try {
            const res = await fetch(BACKEND_URL + `get_user?wallet=${wallet}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            // console.log('resData:', resData);
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                if (resData.user !== undefined) {
                    return resData.user;
                } else {
                    console.log(`can't extract data!`);
                }
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return {name, github, discord, image};
    };

    const setUser = 
        async (wallet, name, github, discord, image) => {
            // const formData = new FormData();

            // formData.append('wallet', wallet);
            // formData.append('name', name);
            // formData.append('github', github);
            // formData.append('discord', discord);
            // // formData.append('image', image);

            // console.log('formData:', formData);

            // axios.post(BACKEND_URL + 'set_user', formData)
            //     .then((response) => {
            //         console.log('response:', response);
            //         // console.log(response.data.details);
            //         return 0;
            //     })
            //     .catch ((error) => {
            //         console.error('Error uploading avatar:', error);
            //         return -1;
            //     });

            try {
                const res = await fetch(BACKEND_URL + 'set_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'wallet': wallet,
                        'name': name,
                        'github': github,
                        'discord': discord,
                        'image': image
                    })
                });
    
                const resData = await res.json();
                if (resData.error) {
                    console.error('error1:', resData.error);
                    return -1;
                } else {
                    console.log(resData.details);
                    return 0;
                }
            } catch (error) {
                console.error('error2:', error);
            }

            return -2;
        };

    const createBountyB = 
        async (wallet, bountyId, title, payAmount, duration, type, difficulty, topic, description, gitHub, block) => {
            try {
                const res = await fetch(BACKEND_URL + 'create_bounty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'wallet': wallet,
                        'bountyId': bountyId,
                        'title': title,
                        'payAmount': payAmount,
                        'duration': duration,
                        'type': type,
                        'difficulty': difficulty,
                        'topic': topic,
                        'description': description,
                        'gitHub': gitHub,
                        'block': block, 
                        'status': BountyStatus.ACTIVE
                    })
                });
    
                const resData = await res.json();
                if (resData.error) {
                    console.error('error1:', resData.error);
                    return -1;
                } else {
                    console.log(resData.details);
                    return 0;
                }
            } catch (error) {
                console.error('error2:', error);
            }

            return -2;
        };

    const getRecentBounties = async () => {
        try {
            const res = await fetch(BACKEND_URL + 'get_recent_bounties', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.bounties;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return [];
    };

    const getSingleBounty = async (bountyId) => {
        try {
            const res = await fetch(BACKEND_URL + `get_single_bounty?bountyId=${bountyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.bounty;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return {};
    };

    const getAppliedBounties = async (wallet) => {
        try {
            const res = await fetch(BACKEND_URL + `get_bounties?wallet=${wallet}&filter=applied`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.bounties;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return [];
    };

    const getCreatedBounties = async (wallet) => {
        try {
            const res = await fetch(BACKEND_URL + `get_bounties?wallet=${wallet}&filter=created`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.bounties;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return [];
    };

    const countSubmissions = async (wallet, bountyId) => {
        try {
            const res = await fetch(BACKEND_URL + `count_submissions?wallet=${wallet}&bountyId=${bountyId}&status=${WorkStatus.SUBMITTED}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                return resData.count;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    const cancelBountyB = async (wallet, bountyId) => {
        try {
            const res = await fetch(BACKEND_URL + 'cancel_bounty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'bountyId': bountyId,
                    'status': BountyStatus.CANCELLED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    const closeBountyB = async (wallet, bountyId) => {
        try {
            const res = await fetch(BACKEND_URL + 'close_bounty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'bountyId': bountyId,
                    'status': BountyStatus.CLOSED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };


    const getWorks = async (bountyId, status) => {
        try {
            const res = await fetch(BACKEND_URL + `get_works?bountyId=${bountyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.works;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return [];
    };

    const createWork = async (wallet, bountyId, workId) => {
        try {
            const res = await fetch(BACKEND_URL + 'create_work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'bountyId': bountyId,
                    'workId': workId,
                    'applyDate': Date.now(),
                    'status': WorkStatus.APPLIED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    const getWork = async (wallet, bountyId) => {
        try {
            const res = await fetch(BACKEND_URL + `get_work?wallet=${wallet}&bountyId=${bountyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
            } else {
                console.log(resData.details);
                return resData.work;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return {};
    };

    const submitWorkB = async (wallet, workId, workTitle, workDesc, workRepo) => {
        try {
            const res = await fetch(BACKEND_URL + 'submit_work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'workId': workId,
                    'title': workTitle,
                    'description': workDesc,
                    'workRepo': workRepo,
                    'submitDate': Date.now(),
                    'status': WorkStatus.SUBMITTED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    const approveWorkB = async (wallet, workId) => {
        try {
            const res = await fetch(BACKEND_URL + 'approve_work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'workId': workId,
                    'status': WorkStatus.APPROVED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    const rejectWorkB = async (wallet, workId) => {
        try {
            const res = await fetch(BACKEND_URL + 'reject_work', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'wallet': wallet,
                    'workId': workId,
                    'status': WorkStatus.REJECTED
                })
            });

            const resData = await res.json();
            if (resData.error) {
                console.error('error1:', resData.error);
                return -1;
            } else {
                console.log(resData.details);
                return 0;
            }
        } catch (error) {
            console.error('error2:', error);
        }

        return -2;
    };

    return {
        getUser, 
        setUser, 

        createBountyB, 
        submitWorkB, 
        approveWorkB, 
        rejectWorkB, 
        cancelBountyB, 
        closeBountyB, 
        
        getRecentBounties, 
        getSingleBounty, 
        getAppliedBounties, 
        getCreatedBounties, 
        countSubmissions, 
        
        createWork, 
        getWorks, 
        getWork, 
    };
};

export default useBackend;
