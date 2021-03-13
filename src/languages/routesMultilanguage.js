export default function routes(keyGen) {
	return {
		// student start
		urlStudents: {
			key: keyGen(),
			defaultMessage: '/'
		},
		urlStudentDetail: {
			key: keyGen(),
			defaultMessage: '/app/student/{studentId}/detail'
		},
		urlStudentEdit: {
			key: keyGen(),
			defaultMessage: '/app/student/{studentId}/edit'
		},
		urlStudentAdd: {
			key: keyGen(),
			defaultMessage: '/app/student/add'
		},
		// student end

		// lesson start
		urlLesson: {
			key: keyGen(),
			defaultMessage: '/app/lesson'
		},
		urlLessonDetail: {
			key: keyGen(),
			defaultMessage: '/app/lesson/{lessonId}/detail'
		},
		urlLessonEdit: {
			key: keyGen(),
			defaultMessage: '/app/lesson/{lessonId}/edit'
		},
		urlLessonAdd: {
			key: keyGen(),
			defaultMessage: '/app/lesson/add'
		},
		// lesson end

		// bill start
		urlBill: {
			key: keyGen(),
			defaultMessage: '/app/bill'
		},
		urlBillDetail: {
			key: keyGen(),
			defaultMessage: '/app/bill/{builId}/detail'
		},
		// bill end

		// group start
		urlGroup: {
			key: keyGen(),
			defaultMessage: '/app/groups'
		},
		urlGroupAdd: {
			key: keyGen(),
			defaultMessage: '/app/groups/add'
		},
		urlGroupDetail: {
			key: keyGen(),
			defaultMessage: '/app/groups/{groupId}/detail'
		},
		urlGroupEdit: {
			key: keyGen(),
			defaultMessage: '/app/groups/{groupId}/edit'
		},
		// group end
		urlTeachers: {
			key: keyGen(),
			defaultMessage: '/app/license'
		},
		urlTextbooks: {
			key: keyGen(),
			defaultMessage: '/app/balance'
		},
		urlMore: {
			key: keyGen(),
			defaultMessage: '/app/withdrawal'
		},
		urlMoreEdit: {
			key: keyGen(),
			defaultMessage: '/app/affiliate'
		},
		urlMoreLog: {
			key: keyGen(),
			defaultMessage: '/app/marketing'
		},
		urlMoreLibrary: {
			key: keyGen(),
			defaultMessage: '/app/operation'
		},
		urlMoreCertificates: {
			key: keyGen(),
			defaultMessage: '/app/support'
		},
		urlMoreBell: {
			key: keyGen(),
			defaultMessage: '/app/legal'
		},
		urlMoreUsers: {
			key: keyGen(),
			defaultMessage: '/2fa-login'
		},
		urlMoreObs: {
			key: keyGen(),
			defaultMessage: '/login'
		},
		url2FA: {
			key: keyGen(),
			defaultMessage: '/2fa-login'
		},
		urlLogin: {
			key: keyGen(),
			defaultMessage: '/login'
		},
		urlAdminLogin: {
			key: keyGen(),
			defaultMessage: '/admin/login'
		},
		urlRegister: {
			key: keyGen(),
			defaultMessage: '/register'
		},
		urlMoreExams: {
			key: keyGen(),
			defaultMessage: '/admin/login'
		},
		urlMoreContracts: {
			key: keyGen(),
			defaultMessage: '/register'
		},
	}
}
