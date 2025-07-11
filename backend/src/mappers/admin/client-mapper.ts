

export class AdminDoctorMapper {
  static toDoctorApprovalSummaryDto(doctor) {
    return {
      id: doctor._id.toString(),
      fullName: doctor.personal.fullName,
      profileImage: doctor.personal.profileImage,
      specialization: doctor.professional.specialization,
    };
  }
}
